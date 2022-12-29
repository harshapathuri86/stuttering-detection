
from hashlib import new
from model.theta_oscillator_main2 import *
import scipy.io.wavfile as wavy
from model.feat_extr_nn2 import *
import math
from model.finding_len_wav_time import *
from model.train_neural_network import *
from scipy.io import savemat
# from model.write_xlsx import *
from model.rep_pro_spu_rem import *


def for_single_file_including_original_boundaries(wave_files, minfreqs, maxfreqs, bandss, Q_values, center_frequencys, thresholds, N_bandss, actual_boundary):
    pks, vals, val_ind, original_array = theta_oscillator_main(
        wave_files, minfreqs, maxfreqs, bandss, Q_values, center_frequencys, thresholds, N_bandss)  # for test file
    index_to_be_removed2 = []
    index_to_be_removed_rep = []

    print("len of valley indices", len(val_ind))
    if len(val_ind) > actual_boundary+3:
        final_peaks_points1, final_valley_points1, ori_valley_points, index_to_be_removed = removing_spurious_peaks(
            original_array, pks, vals)  # ,val_inda
        final_peaks_points, final_valley_points = removing_indexes_for_all_types(
            index_to_be_removed, pks, vals)
        final_pks_points2, final_valley_points2, ori_valley_points2, index_to_be_removed2 = for_prolongation(
            original_array, pks, vals)

        final_peaks_points3, final_valley_points3 = removing_indexes_for_all_types(
            index_to_be_removed2, final_peaks_points, final_valley_points)
        final_pks_points_rep, final_valley_points_rep, ori_valley_points_rep, index_to_be_removed_rep = for_repetation1(
            original_array, pks, vals)
        final_peaks_points4, final_valley_points4 = removing_indexes_for_all_types(
            index_to_be_removed_rep, final_peaks_points3, final_valley_points3)
        return pks, vals, index_to_be_removed2, index_to_be_removed_rep

    else:
        return pks, vals, index_to_be_removed2, index_to_be_removed_rep


minfreq = 50  # 100    #50 #my 50
maxfreq = 7500  # 5000    #7500 #my7500
bands = 40  # 10    #20 for gammatone #my 10
Q_value = 0.8  # Q-value of the oscillator, default = 0.5 = critical damping #my 0.8
center_frequency = 8  # in Hz #my 5
threshold = 0.025  # my 0.025
N_bands = 40  # theta oscillator #my 30

final_labels = []
final_feats = []
final_labels_pred = []
final_feats_pred = []
original_bound_count = 28


def get_output(wave_file):

    act_pks, act_vals, pro_ind, rep_ind = for_single_file_including_original_boundaries(
        wave_file, minfreq, maxfreq, bands, Q_value, center_frequency, threshold, N_bands, original_bound_count)
    print("pro_ind", len(pro_ind), "rep_ind", len(
        rep_ind), len(act_pks), len(act_vals))
    return pro_ind, rep_ind, act_pks, act_vals