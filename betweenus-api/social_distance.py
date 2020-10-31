import math
import numpy as np


def check_social_distance(centers, angles, idx, threshold=2):
    """
    return flag of alert if social distancing is violated
    """
    xx = centers[idx][0]
    zz = centers[idx][1]
    angle = angles[idx]
    distances = [math.sqrt((xx - centers[i][0]) ** 2 + (zz - centers[i][1]) ** 2) for i, _ in enumerate(centers)]
    sorted_idxs = np.argsort(distances)

    for i in sorted_idxs[1:]:

        # First check for distance
        if distances[i] > threshold:
            return False

        # More accurate check based on orientation and future position
        elif check_social_distance_advanced((xx, centers[i][0]), (zz, centers[i][1]), (angle, angles[i])):
            return True

    return False


def check_social_distance_advanced(xxs, zzs, angles, threshold=2):
    """
    Violation if same angle or in in front of the other
    Obtained by assuming straight line, constant velocity and discretizing trajectories
    """
    theta0 = angles[0]
    theta1 = angles[1]
    steps = np.linspace(0, 2, 20)  # Discretization 20 steps in 2 meters
    xs0 = [xxs[0] + step * math.cos(theta0) for step in steps]
    zs0 = [zzs[0] - step * math.sin(theta0) for step in steps]
    xs1 = [xxs[1] + step * math.cos(theta1) for step in steps]
    zs1 = [zzs[1] - step * math.sin(theta1) for step in steps]
    distances = [math.sqrt((xs0[idx] - xs1[idx]) ** 2 + (zs0[idx] - zs1[idx]) ** 2) for idx, _ in enumerate(xs0)]
    if np.min(distances) <= max(distances[0] / 1.5, threshold):
        return True
    return False


def are_subjects_too_close(dic_out):
    angles = dic_out['angles']
    xz_centers = [[xx[0], xx[2]] for xx in dic_out['xyz_pred']]

    return [check_social_distance(xz_centers, angles, idx) for idx, _ in enumerate(dic_out['xyz_pred'])]
