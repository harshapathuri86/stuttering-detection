import os
import numpy as np
import scipy.io.wavfile as wavy
import pandas as pd
import webrtcvad
from pydub import AudioSegment
import math
from python_speech_features import mfcc
from collections import Counter


# def finding_time_lengths(wav_file,excel_file):
def finding_time_lengths(wav_file,s,f,c):
    (rate,sig)=wavy.read(wav_file)
    newAudio = AudioSegment.from_wav(wav_file)
    time=newAudio.duration_seconds
    wa_len=len(sig)
    # s,f,c=reading_excel(excel_file,3)
    print(len(s),len(f),len(c))
    # final_labes=np.zeros(wa_len)
    final_labes=[0]*wa_len
    print("fniii",len(final_labes))
    for i in range(len(s)):
        st_ind=math.ceil(s[i]*rate)
        ed_ind=math.ceil(f[i]*rate)
        # print(st_ind,ed_ind)
        # final_labes[st_ind:ed_ind]=math.ceil(c[i])
        for j in range(st_ind,ed_ind):
            # final_labes[j]=int(c[i])
            try:
                final_labes[j]=int(c[i])
            except:
                if len(final_labes)<ed_ind: 
                    # final_labes[j]=final_labes[j-1] 
                    continue
    
    return final_labes

def reading_excel(excel_file,stutter_code):
    stt=[]
    fnn=[]
    code=[]
    df = pd.read_excel(excel_file)
    for index, row in df.iterrows():
          # syll_name_list.append(row['Syllables'])
        # if row['Stutter_code']==stutter_code:
            code.append(int(row['Stutter_code']))
            stt.append(row['Start_time'])
            fnn.append(row['End_time'])
            # stt.append(row['Start_time'])
            # fnn.append(row['End_time'])
            # word.append(row['Syllables'])
    return stt,fnn,code
def uniq_label_list(true_lab,st_pt,end_pt):
    val_list=[]
    val_list.extend(true_lab[st_pt:end_pt])
    uniq_val=[]
    # print("val ls",val_list)
    for i in range(len(val_list)):
        if val_list[i] not in uniq_val:
            uniq_val.append(val_list[i])
    print("uniq val list",uniq_val)
    if len(uniq_val)>1:
        ma=0
    
        duplicate_dict = Counter(val_list)
        # print(duplicate_dict)
        for k in duplicate_dict:
            if duplicate_dict[k]>ma:
                ma=k
        # print("ma",ma)
        return ma
    elif len(uniq_val)==1:
        print("jkil",uniq_val)
        return uniq_val[0]
    else:
        a=0
        return a


    
def chopping(aud,pred_st1,pred_ed1,dest_all,wav_name,c,original_label,rt):

    # newAudio = AudioSegment.from_wav(aud)
    pred_st=round(pred_st1,3)*1000
    pred_ed=round(pred_ed1,3)*1000
    print("pred_st",pred_st,"pred_ed",pred_ed)

    p1=math.ceil(pred_st1*rt)
    p2=math.ceil(pred_ed1*rt)
    print("p1 predict",p1,"p2_predict",p2,"original_label",len(original_label))
    # stt=int(round(stt,3)*1000)
    # fnn=int(round(fnn,3)*1000)
    audi=aud[pred_st:pred_ed]
    # wav_split=wav_file.split('/')[-1]
    wad=wav_name.split('.')[0]
    wav_name=wad+'_'+str(c)+'.wav'
    dest_wav_path=os.path.join(dest_all,wav_name)
    audi.export(dest_wav_path, format="wav")
    
    rates,audio=wavy.read(os.path.join(dest_all,wav_name))
    label_val=uniq_label_list(original_label,p1,p2)
    label=label_val
    # print("rate",rate)
    # mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
    # label=[]
    # mfcc_feats=[]
    mfcc_feat=mfcc(audio,samplerate=rates,numcep=13,nfilt=26,preemph=0.97)
    # mfcc_feats.append(mfcc_feat)
    
    return label,mfcc_feat
def chopping_feat_extrt(wav_file,org_labels,syll_bound,dest):
    rate_whole,audio=wavy.read(wav_file)
    wav_split=wav_file.split('/')[-1]
    newAudio = AudioSegment.from_wav(wav_file)
    count=1
    final_lab=[]
    final_feat=[]
    # for j in range(0,len(predict_bound)-1):
    for i in range(len(syll_bound)-1):
        lab1,feat1=chopping(newAudio,syll_bound[i],syll_bound[i+1],dest,wav_split,count,org_labels,rate_whole)
        print("lab",lab1,type(lab1))
        final_lab.append(lab1)
        final_feat.append(feat1)
        # print("final feat",len(final_feat))
        # print("final lab",len(final_lab))
        # break
        count=count+1
    print("final feat",len(final_feat))
    print("final lab",len(final_lab))
    return final_lab,final_feat

# excel_files='/home/north/Videos/theta_experiments/old_excel_files/sneha_bengaluru_1.xlsx'
# wave_files='/home/north/Videos/theta_experiments/old_wav_resamp/sneha_bengaluru_1.wav'
# dest=''
# original_labels=finding_time_length(wave_files,excel_files)
# # print(original_labels[74052:74153])
# print(original_labels[6059:6153]) 




