
from hashlib import new
from theta_oscillator_main2 import *
import scipy.io.wavfile as wavy
from feat_extr_nn2 import *
import math
from finding_len_wav_time import *
from train_neural_network import *
from scipy.io import savemat
from write_xlsx import *
from rep_pro_spu_rem import *

def reading_dir(labels_path,wave_path):
  folder=os.listdir(labels_path)    
  wav_list=[]
  excel_list=[]
  stt=[]
  fnn=[]
  code=[]
  for file in folder:
      # print("file name",file)
      flag=0
      ff = file.split(".")[0]
      print("ff",ff)
      df = pd.read_excel(labels_path+file)
      file_excel=labels_path+file
      excel_list.append(file_excel)
      wav=wave_path+ff+".wav"
      wav_list.append(wav)
      # newAudio = AudioSegment.from_wav(wav)
      # time=newAudio.duration_seconds
      # tot_duration+=time
      # t1=0

      st=[]
      fn=[]
      cde=[]
      # print("stutter codes",type(df.Stutter_code))
      for index, row in df.iterrows():
          if row['Stutter_code']=='skip' or row['Start_time']=='skip' or row['End_time']=='skip' or row['Start_time']=='SKIP' or row['Start_time']=='' or row['Start_time'] =='NaN' or row['End_time']=='NaN' or row['End_time'] =='SKIP' or row['End_time']=='' or row['Stutter_code']=='SKIP' or row['Stutter_code']=='' or row['Stutter_code']=='skip' or row['Stutter_code']=='NaN':
            print("insie first else")
          else:
              st.append(row['Start_time'])
              fn.append(row['End_time'])
              cde.append(row['Stutter_code'])
            #   if type(row['Syllables'])=='str':
            #     syll_name.append(row['Syllables'].lower())
            #   else:
            #     syll_name.append(row['Syllables'])
    #   (rate,sig) = wavy.read(wav)
      stt.append(st)
      fnn.append(fn)
      code.append(cde)
  return stt,fnn,code,wav_list,excel_list
# def plotting(s,f,wav,fs):
#   pl.figure(figsize=(18,8))
#   time_axis = [i*1./fs for i in range(len(wav))]
#   pl.plot(time_axis, wav)
#   pl.xlim((-0.01, (len(wav))*1./fs+0.01))
#   # time_axis = [i*1./1000 for i in range(len(outh))]
#   # pl.plot(time_axis, outh)
  
#   for vi in f:
#       pl.axvline(vi, ymin=0, ymax=1, color='r', linestyle='dashed')

#   # for vi in s:
#   #     pl.axvline(vi, ymin=0, ymax=1, color='b', linestyle='dashed')  
    
#   ## Plot syll nuclei
#   # for pi in peak_indices:
#   #     pl.axvline(pi*1./1000, ymin=0, ymax=1, color = 'g', linestyle='dashed')

#   ## Plot true boundaries
#   # zz = [0, 0.264, 0.446, 0.573, 0.7854];
#   # for z in zz:
#   #    pl.axvline(z, ymin=0, ymax=1, color = 'k', linestyle='dashed')
      
      
#   pl.legend(['signal', 'sonority', 'estimated syll boundaries']);
#   pl.title('Theta oscillator based syllable boundary detection');
#   pl.xlabel ('Time [s]')
# #   pl.show()


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
    # print("stutter codes",type(df.Stutter_code))
    for index, row in df.iterrows():
        # syll_name_list.append(row['Syllables'])
        # if row['Stutter_code']==stutter_code:
            code.append(int(row['Stutter_code']))
            stt.append(row['Start_time'])
            fnn.append(row['End_time'])
    print("in boundaries original",len(stt),len(fnn),len(code))
    # (rate,sig) = wavy.read(wav_file)
    # plotting(stt,fnn,sig,rate)
    return stt,fnn,code,wav_folder,excel_folder
    # return stt,fnn

def finding_time_length(wav_file,excel_file):
    (rate,sig)=wavy.read(wav_file)
    newAudio = AudioSegment.from_wav(wav_file)
    time=newAudio.duration_seconds
    wa_len=len(sig)
    s,f,c=reading_excel(excel_file,3)
    print("in finding time length",len(s),len(f),len(c))
    # final_labes=np.zeros(wa_len)
    final_labes=[0]*wa_len
    print("fniii",len(final_labes))
    for i in range(len(s)):
        st_ind=math.ceil(s[i]*rate)
        ed_ind=math.ceil(f[i]*rate)
        # print(st_ind,ed_ind)
        # final_labes[st_ind:ed_ind]=math.ceil(c[i])
        for j in range(st_ind,ed_ind):
            final_labes[j]=int(c[i])
    
    return final_labes



def changing_count_peakvalues(predicted_boundaries,threshold_val,actual_boundaries):
    print("pred",predicted_boundaries)
    fin_new_pred_bound=[]
    a=1
    while a==1: 
        new_pred_bound=[]
        # print("inside while")
        if len(predicted_boundaries)==len(actual_boundaries):
            a=0
            # print("inside if")
            new_pred_bound = predicted_boundaries 
            return new_pred_bound
        elif len(predicted_boundaries)<=len(actual_boundaries):
            a=0
            # print("inside elif")
            new_pred_bound = predicted_boundaries 
            return new_pred_bound
        elif len(predicted_boundaries)>len(actual_boundaries):
            # print("inside elifif")
            new_pred_bound.append(predicted_boundaries[0])
            for i in range(len(predicted_boundaries)-1):
                # print("inside for",predicted_boundaries[i+1],predicted_boundaries[i])
                if predicted_boundaries[i+1]-predicted_boundaries[i]>=threshold_val:
                    # print("inside for if")
                    new_pred_bound.append(predicted_boundaries[i+1])
            print("new ",len(new_pred_bound))
            a=0
            return new_pred_bound
            # if len(new_pred_bound)>=len(actual_boundaries)+3:
            #     print("inside if of outside")
            #     threshold_val=threshold_val-0.03

            #     asdf=changing_count_peakvalues(new_pred_bound,threshold_val,actual_boundaries)
            #     # a=0
            #     return asdf
            # else:
            #     a=0
            #     return new_pred_bound 

# def for_single_file(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss,end_lists,st_lists):
def for_single_file(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss):
    # pks,vals,val_ind,original_array=theta_oscillator_main(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss,end_lists,st_lists)
    pks,vals,val_ind,original_array=theta_oscillator_main(wave_files,minfreqs,maxfreqs,bandss,Q_values,center_frequencys,thresholds,N_bandss)#for test file

    # pks,vals,val_ind=theta_oscillator_main(wave_list[k],minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands,end_list[k],st_list[k])
    # print("wave_name",wave_list[0],"pks len",len(pks),"vals len",len(vals),"val_ind len",len(val_ind))
    # st_list,end_list=boundaries_original(excel_file,wave_file,0,excel_path,waves_path)

    final_peaks_points1,final_valley_points1,ori_valley_points,index_to_be_removed=removing_spurious_peaks(original_array,pks,vals)#,val_inda
    print("index_to_be_removed after removing spurious",index_to_be_removed)
    final_peaks_points,final_valley_points=removing_indexes_for_all_types(index_to_be_removed,pks,vals)
    print("valleys after bb",final_valley_points,len(final_valley_points))
    print("pks after bb",final_peaks_points,len(final_peaks_points))

    # final_pks_points2,final_valley_points2,ori_valley_points2,index_to_be_removed2=for_prolongation(original_array,final_peaks_points,final_valley_points)
    final_pks_points2,final_valley_points2,ori_valley_points2,index_to_be_removed2=for_prolongation(original_array,pks,vals)
    
  
    print("index_to_be_removed after prolongation",index_to_be_removed2)
    final_peaks_points3,final_valley_points3=removing_indexes_for_all_types(index_to_be_removed2,final_peaks_points,final_valley_points)

    # final_pks_points_rep,final_valley_points_rep,ori_valley_points_rep,index_to_be_removed_rep=for_repetation1(original_array,final_peaks_points3,final_valley_points3)
    final_pks_points_rep,final_valley_points_rep,ori_valley_points_rep,index_to_be_removed_rep=for_repetation1(original_array,pks,vals)

    print("after repetation",index_to_be_removed_rep)
    print("peak_repeat",final_pks_points_rep)
    print("valley repeat",final_valley_points_rep)
    final_peaks_points4,final_valley_points4=removing_indexes_for_all_types(index_to_be_removed_rep,final_peaks_points3,final_valley_points3)
    print("final peaks after repeat",final_peaks_points4,len(final_peaks_points4),"final valleys after repeat",final_valley_points4,len(final_valley_points4))

    # val_ind=val_ind/1000
    # print("val ind",val_ind)
    # pks=pks[:,0]
    # pks=pks/1000
    # vals=vals[:,0]
    # vals=vals/1000
    # print("pks",pks)
    # print("vals",vals)
    # print("val ind",val_ind) 
    
    
    
    # final_syll_bound=changing_count_peakvalues(val_ind,0.2,end_list)
    # pred_bound_all.append(val_ind)
    # final_pred_bound.append(final_syll_bound)
    # print("len of final predicted boundaries",len(final_syll_bound))
    # original_labels=finding_time_lengths(wave_list[0],st_list,end_list,code_list)
    # # lab,feat=chopping_extracting_feat(wave_file,excel_file,final_syll_bound,chopped_dest)
    # # chopping_extracting_feat(wave_file,excel_file,final_bound,chopped_dest)

    # lab,feat=chopping_feat_extrt(wave_list[0],original_labels,final_syll_bound,chopped_dest) #need to run for final boun afer running changinh count peak values
    # lab_pred,feat_pred=chopping_feat_extrt(wave_list[0],original_labels,val_ind,chopped_dest) #need to run only to get label for predicted bound
    # final_labels.append(lab)
    # final_feats.append(feat)
    # final_labels_pred.append(lab_pred)
    # final_feats_pred.append(feat_pred)
    return index_to_be_removed2,index_to_be_removed_rep





# wa1='/content/gdrive/MyDrive/aiish_04_08/old_wav_resamp/sneha_bengaluru_4.wav'
# wa2='/content/gdrive/MyDrive/aiish_04_08/old_wav_resamp/sneha_bengaluru_1.wav'
#original values
minfreq = 50   #100    #50 #my 50
maxfreq = 7500   #5000    #7500 #my7500
bands = 40      #10    #20 for gammatone #my 10
Q_value = 0.8  # Q-value of the oscillator, default = 0.5 = critical damping #my 0.8
center_frequency = 8 # in Hz #my 5
threshold = 0.025 #my 0.025
N_bands=40  #theta oscillator #my 30

# excel_path='/home/vamshi/Videos/theta_exp/old_excel_files/'
# waves_path='/home/vamshi/Videos/theta_exp/old_wav_resamp/'
# excel_file='/home/vamshi/Videos/theta_exp/old_excel_files/nithin_bengaluru_1.xlsx'
# wave_file='/home/vamshi/Videos/theta_exp/old_wav_resamp/nithin_bengaluru_1.wav'
# chopped_dest='/home/vamshi/Videos/theta_exp/chopped_audios/'

final_labels=[]
final_feats=[]
final_labels_pred=[]
final_feats_pred=[]

# excel_path='/home/north/Videos/theta_experiments/old_excel_files/'
# waves_path='/home/north/Videos/theta_experiments/old_wav_resamp/'
excel_path='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/stutter/excel_files/'
waves_path='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/stutter/wav_files/'
excel_file='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/clean/excel_files/manjushree_bengaluru_2.xlsx'
wave_file='/home/north/Videos/theta_experiments/raghu_folder/syllable_detection/clean/wav_files/manjushree_bengaluru_2.wav'
chopped_dest='/home/north/Videos/theta_experiments/chopped_audios/'

# dire=0
# st_list,end_list,code_list,wave_list,excel_lst=boundaries_original(excel_file,wave_file,dire,excel_path,waves_path)
# print("start len",len(st_list),"end len",len(end_list),"code ist",len(code_list),"waves len",len(wave_list))
# # co=0
# pred_bound_all=[]
# final_pred_bound=[]

# pro_ind,rep_ind=for_single_file(wave_file,minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands,end_list,st_list)
pro_ind,rep_ind=for_single_file(wave_file,minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands)

# diff_vals=for_repetation1(pk,vl)
# final_pks_points,final_valley_points,valley_ind_vals,index_list=for_repetation1(pk,vl)




# for k in range(len(st_list)):
#     # print("original boundaries len ",st_list[k],end_list[k])
#     pks,vals,val_ind=theta_oscillator_main(wave_file,minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands,end_list[k],st_list[k])
#     # pks,vals,val_ind=theta_oscillator_main(wave_list[k],minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands,end_list[k],st_list[k])
#     print("wave_name",wave_list[k],"pks len",len(pks),"vals len",len(vals),"val_ind len",len(val_ind))
#     # st_list,end_list=boundaries_original(excel_file,wave_file,0,excel_path,waves_path)
#     val_ind=val_ind/1000
#     # print(val_ind)

    
#     final_syll_bound=changing_count_peakvalues(val_ind,0.2,end_list[k])
#     pred_bound_all.append(val_ind)
#     final_pred_bound.append(final_syll_bound)
#     print("len of final predicted boundaries",len(final_syll_bound))
#     original_labels=finding_time_lengths(wave_list[k],st_list[k],end_list[k],code_list[k])
    
    
    
    
#     # lab,feat=chopping_extracting_feat(wave_file,excel_file,final_syll_bound,chopped_dest)
#     # chopping_extracting_feat(wave_file,excel_file,final_bound,chopped_dest)

#     lab,feat=chopping_feat_extrt(wave_list[k],original_labels,final_syll_bound,chopped_dest) #need to run for final boun afer running changinh count peak values
#     lab_pred,feat_pred=chopping_feat_extrt(wave_list[k],original_labels,val_ind,chopped_dest) #need to run only to get label for predicted bound
#     final_labels.append(lab)
#     final_feats.append(feat)
#     final_labels_pred.append(lab_pred)
#     final_feats_pred.append(feat_pred)
#     # if k==5:
#     #     break

# print("finals",len(final_labels))
# print("finals feat",len(final_feats),np.shape(final_feats),np.shape(final_feats[0]),np.shape(final_feats[0][0]))




#saving the features in mat file......................................................
# lab_dict = {k: v for k, v in zip(wave_list, final_labels)}
# feat_dict={k: v for k, v in zip(wave_list, final_feats)}
# savemat("theta_mfcc_features.mat",feat_dict)
# savemat("theta_mfcc_labels.mat",lab_dict)
# savemat("theta_mfcc_labels_feats.mat",lab_dict)
# savemat("theta_mfcc_labels_feats.mat",lab_dict)
#completed saving the features in mat file................................................



# for writinfg into an exel file............................................
# asdf=[]
# content=['wave_name','original_count_of_syllables','predicted_count_of_syllables','final_predicted_count_of_syllables','stutter_codes','pred_codes','changed_pred_codes']
# asdf.append(content)
# asdf.append(wave_list)
# asdf.append(st_list)
# asdf.append(pred_bound_all)
# asdf.append(final_pred_bound)
# asdf.append(code_list)
# asdf.append(final_labels_pred)
# asdf.append(final_labels)
# al_list_wrting(asdf)
# book.close()
# excel file writing completed.................................................



# xarr,yarr=making_x_y(final_labels,final_feats)
# stuttuer_code=3
# yarr=making_Y_stutter_code(yarr,stuttuer_code)
# print("yarr",len(yarr),len(xarr))
# # print(yarr[5000:5500])


# from collections import Counter
# counter = Counter(yarr)
# print("counter before aplying smoote",counter)
# xarr,yarr=smoothe(xarr,yarr)# not required when running creating_under_arrays
# sample_size=0.3
# X_trainsm, X_testsm, y_trainsm, y_testsm=split(xarr,yarr,sample_size)
# # X_trainsm, X_testsm, y_trainsm, y_testsm=split(xarr,yarr,sample_size)
# print("xtrain shape",np.shape(X_trainsm),"y train shape",np.shape(y_trainsm))
# shape_input_mfc=np.asarray(X_trainsm).shape
# # shape_input_sdc=np.asarray(X_trainsm_sdc).shape

# print("input shape for model",shape_input_mfc,shape_input_mfc[0],shape_input_mfc[1])
# # print(shape_input_sdc,shape_input_sdc[0],shape_input_sdc[1])

# calling neural netwok model...............................................
# model=model_creation(shape_input_mfc[1])
# model.fit(X_trainsm, y_trainsm, epochs=25, batch_size=16,shuffle=True)
# # preds = model.evaluate(X_testsm,y_testsm)
# # print(preds[1])
# yhat_classess=(model.predict(X_testsm) > 0.5).astype("int16")
# yhat_classess = yhat_classess[:, 0]
# precisions = precision_score(y_testsm, yhat_classess)
# print('Precision: %f' % precisions)
# recalls = recall_score(y_testsm, yhat_classess)
# print('Recall: %f' % recalls)
# accuracys = accuracy_score(y_testsm, yhat_classess)
# print('Accuracy: %f' % accuracys)
# confusion_mat(y_testsm, yhat_classess)
# ending of neural ntework model.......................................



#calling svm classifier .................................................... 

# svm_model=svm_classifier()
# svm_model.fit(X_trainsm, y_trainsm)
# y_pred_svm_train = svm_model.predict(X_testsm)
# print("precision",precision_score(y_testsm, y_pred_svm_train))
# print("recall",recall_score(y_testsm, y_pred_svm_train))
# print("accuracy for train",accuracy_score(y_testsm, y_pred_svm_train))
# confusion_mat(y_testsm, y_pred_svm_train)

# ending of svm classifier.....................................................




