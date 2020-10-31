from argparse import Namespace

import torch
import torchvision
from PIL import Image, ImageFile

from monoloco.network import PifPaf


def image_transform(image):

    normalize = torchvision.transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
    transforms = torchvision.transforms.Compose([torchvision.transforms.ToTensor(), normalize, ])
    return transforms(image)


def load_image(img_path: str):
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    with open(img_path, 'rb') as f:
        image = Image.open(f).convert('RGB')

    original_image = torchvision.transforms.functional.to_tensor(image)  # 0-255 --> 0-1
    image = image_transform(image)

    return original_image, image


def predict(img_path: str, device='cuda', num_workers=1):
    args = Namespace(basenet=None, checkpoint=None, command='predict', connection_method='max', debug_file_prefix=None,
                     debug_paf_indices=[], debug_pif_indices=[], decoder_workers=None, device=device,
                     loader_workers=num_workers, dilation=None, dilation_end=None, draw_box=False, dropout=0.2,
                     fixed_b=None, force_complete_pose=True, head_dilation=1, head_dropout=0.0, head_kernel_size=1,
                     head_padding=0, glob=None, head_quad=0, headnets=['pif', 'paf'], hidden_size=512,
                     images=[img_path], instance_threshold=0.15, json_dir=None, keypoint_threshold=None,
                     model='data/models/monoloco-191018-1459.pkl', n_dropout=0, networks=['monoloco'],
                     output_directory='data/output', output_types=['front', 'bird'], paf_th=0.1,
                     path_gt='data/arrays/names-kitti-190513-1754.json', pif_fixed_scale=None, predict=False,
                     pretrained=True, profile_decoder=None, scale=1.0, seed_threshold=0.2, show=False, social=True,
                     transform='None', two_scale=False, webcam=False, z_max=10)

    pifpaf = PifPaf(args)
    data = load_image(img_path)
    data_loader = torch.utils.data.DataLoader(
        [data], batch_size=1, shuffle=False,
        pin_memory=True, num_workers=num_workers)

    for idx, (image_tensors, processed_images_cpu) in enumerate(data_loader):
        images = image_tensors.permute(0, 2, 3, 1)

        processed_images = processed_images_cpu.to(args.device, non_blocking=True)
        fields_batch = pifpaf.fields(processed_images)

        # unbatch
        for image, processed_image_cpu, fields in zip(
                images, processed_images_cpu, fields_batch):
            _, _, pifpaf_out = pifpaf.forward(image, processed_image_cpu, fields)

            return pifpaf_out


def main():
    p = predict('images/beatles.jpg')
    print(p)
    pass


if __name__ == '__main__':
    main()
