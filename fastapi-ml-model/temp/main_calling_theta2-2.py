from hashlib import new
from theta_oscillator_main2 import *
import scipy.io.wavfile as wavy
from feat_extr_nn2 import *
import math
#from finding_len_wav_time import *
#from train_neural_network import *
from scipy.io import savemat
#from write_xlsx import *
#from rep_pro_spu_rem import *

def reading_dir(labels_path,wave_path):
  folder=os.listdir(labels_path)    
  wav_list=[]
  excel_list=[]
  stt=[]
  fnn=[]
  code=[]
  for file in folder:
      flag=0
      ff = file.split(".")[0]
      print("ff",ff)
      df = pd.read_excel(labels_path+file)
      file_excel=labels_path+file
      excel_list.append(file_excel)
      wav=wave_path+ff+".wav"
      wav_list.append(wav)

      st=[]
      fn=[]
      cde=[]
      for index, row in df.iterrows():
          if row['Stutter_code']=='skip' or row['Start_time']=='skip' or row['End_time']=='skip' or row['Start_time']=='SKIP' or row['Start_time']=='' or row['Start_time'] =='NaN' or row['End_time']=='NaN' or row['End_time'] =='SKIP' or row['End_time']=='' or row['Stutter_code']=='SKIP' or row['Stutter_code']=='' or row['Stutter_code']=='skip' or row['Stutter_code']=='NaN':
            print("insie first else")
          else:
              st.append(row['Start_time'])
              fn.append(row['End_time'])
              cde.append(row['Stutter_code'])
      stt.append(st)
      fnn.append(fn)
      code.append(cde)
  return stt,fnn,code,wav_list,excel_list
  

    

      
      


def boundaries_original(csv_file,wav_file,dire,label_path,wav_path):
  if dire:
    stt,end,cd,wav_folder,excel_folder=reading_dir(label_path,wav_path)
    return stt,end,cd,wav_folder,excel_folder
  else:
    wav_folder=[]
    excel_folder=[]
    df = pd.read_excel(csv_file)
    wav_folder.append(wav_file)
    excel_folder.append(csv_file)
    stt=[]
    fnn=[]
    code=[]
    for index, row in df.iterrows():
            code.append(int(row['Stutter_code']))
            stt.append(row['Start_time'])
            fnn.append(row['End_time'])
    print("in boundaries original",len(stt),len(fnn),len(code))
    return stt,fnn,code,wav_folder,excel_folder

def finding_time_length(wav_file,excel_file):
    (rate,sig)=wavy.read(wav_file)
    newAudio = AudioSegment.from_wav(wav_file)
    time=newAudio.duration_seconds
    wa_len=len(sig)
    s,f,c=reading_excel(excel_file,3)
    print("in finding time length",len(s),len(f),len(c))
    final_labes=[0]*wa_len
    print("fniii",len(final_labes))
    for i in range(len(s)):
        st_ind=math.ceil(s[i]*rate)
        ed_ind=math.ceil(f[i]*rate)
        for j in range(st_ind,ed_ind):
            final_labes[j]=int(c[i])
    
    return final_labes



def changing_count_peakvalues(predicted_boundaries,threshold_val,actual_boundaries):
    print("pred",predicted_boundaries)
    fin_new_pred_bound=[]
    a=1
    while a==1: 
        new_pred_bound=[]
        if len(predicted_boundaries)==len(actual_boundaries):
            a=0
            new_pred_bound = predicted_boundaries 
            return new_pred_bound
        elif len(predicted_boundaries)<=len(actual_boundaries):
            a=0
            new_pred_bound = predicted_boundaries 
            return new_pred_bound
        elif len(predicted_boundaries)>len(actual_boundaries):
            new_pred_bound.append(predicted_boundaries[0])
            for i in range(len(predicted_boundaries)-1):
                if predicted_boundaries[i+1]-predicted_boundaries[i]>=threshold_val:
                    new_pred_bound.append(predicted_boundaries[i+1])
            print("new ",len(new_pred_bound))
            a=0
            return new_pred_bound


def for_single_file(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss):
    pks,vals,val_ind,original_array= theta_oscillator_main(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss)#for test file

    
    

    
    final_peaks_points1,final_valley_points1,ori_valley_points,index_to_be_removed=removing_spurious_peaks(original_array,pks,vals)#,val_inda
    print("index_to_be_removed after removing spurious",index_to_be_removed)
    final_peaks_points,final_valley_points=removing_indexes_for_all_types(index_to_be_removed,pks,vals)
    print("valleys after bb",final_valley_points,len(final_valley_points))
    print("pks after bb",final_peaks_points,len(final_peaks_points))

    final_pks_points2,final_valley_points2,ori_valley_points2,index_to_be_removed2=for_prolongation(original_array,pks,vals)
    
  
    print("index_to_be_removed after prolongation",index_to_be_removed2)
    final_peaks_points3,final_valley_points3=removing_indexes_for_all_types(index_to_be_removed2,final_peaks_points,final_valley_points)

    final_pks_points_rep,final_valley_points_rep,ori_valley_points_rep,index_to_be_removed_rep=for_repetation1(original_array,pks,vals)

    print("after repetation",index_to_be_removed_rep)
    print("peak_repeat",final_pks_points_rep)
    print("valley repeat",final_valley_points_rep)
    final_peaks_points4,final_valley_points4=removing_indexes_for_all_types(index_to_be_removed_rep,final_peaks_points3,final_valley_points3)
    print("final peaks after repeat",final_peaks_points4,len(final_peaks_points4),"final valleys after repeat",final_valley_points4,len(final_valley_points4))

    
    
    

    return index_to_be_removed2,index_to_be_removed_rep




def for_single_file_including_original_boundaries(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss,actual_boundary):
    pks,vals,val_ind,original_array=theta_oscillator_main(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss)#for test file
    index_to_be_removed2=[]
    index_to_be_removed_rep=[]
    
    
    print("len of valley indices",len(val_ind))
    if len(val_ind)> actual_boundary+3:
        final_peaks_points1,final_valley_points1,ori_valley_points,index_to_be_removed=removing_spurious_peaks(original_array,pks,vals)#,val_inda
        final_peaks_points,final_valley_points=removing_indexes_for_all_types(index_to_be_removed,pks,vals)

        final_pks_points2,final_valley_points2,ori_valley_points2,index_to_be_removed2=for_prolongation(original_array,pks,vals)
        
    
        final_peaks_points3,final_valley_points3=removing_indexes_for_all_types(index_to_be_removed2,final_peaks_points,final_valley_points)

        final_pks_points_rep,final_valley_points_rep,ori_valley_points_rep,index_to_be_removed_rep=for_repetation1(original_array,pks,vals)

        final_peaks_points4,final_valley_points4=removing_indexes_for_all_types(index_to_be_removed_rep,final_peaks_points3,final_valley_points3)
        return pks,vals,index_to_be_removed2,index_to_be_removed_rep
        
    else:
        return pks,vals,index_to_be_removed2,index_to_be_removed_rep
    
    
minfreq = 50   #100    #50 #my 50
maxfreq = 7500   #5000    #7500 #my7500
bands = 40      #10    #20 for gammatone #my 10
Q_value = 0.8  # Q-value of the oscillator, default = 0.5 = critical damping #my 0.8
center_frequency = 8 # in Hz #my 5
threshold = 0.025 #my 0.025
N_bands=40  #theta oscillator #my 30

final_labels=[]
final_feats=[]
final_labels_pred=[]
final_feats_pred=[]

excel_path='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/stutter/excel_files/'
waves_path='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/stutter/wav_files/'
excel_file='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/clean/excel_files/nithin_bengaluru_1.xlsx'
wave_file='/home/harsha/Downloads/BabyElephantWalk60.wav'
chopped_dest='/home/north/Videos/theta_experiments/chopped_audios/'

original_bound_count=15
act_pks,act_vals,pro_ind,rep_ind=for_single_file_including_original_boundaries(wave_file,minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands,original_bound_count)
print("pro_ind",len(pro_ind),"rep_ind",len(rep_ind),len(act_pks),len(act_vals))
