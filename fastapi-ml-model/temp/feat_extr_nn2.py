import os
import scipy.io.wavfile as wavy
import pydub
import shutil
import pandas as pd
from pydub import AudioSegment
import numpy as np
from python_speech_features import mfcc


def reading_excel(excel_file,stutter_code):
    stt=[]
    fnn=[]
    code=[]
    df = pd.read_excel(excel_file)
    for index, row in df.iterrows():
          # syll_name_list.append(row['Syllables'])
        # if row['Stutter_code']==stutter_code:
            code.append(row['Stutter_code'])
            stt.append(row['Start_time'])
            fnn.append(row['End_time'])
            # word.append(row['Syllables'])
    return stt,fnn,code
def chopping(aud,stt,fnn,code,pred_st,pred_ed,dest_all,wav_name,c):

    # newAudio = AudioSegment.from_wav(aud)
    pred_st=int(round(pred_st,3)*1000)
    pred_ed=int(round(pred_ed,3)*1000)
    # p1=pred_st
    # p2=pred_ed
    stt=int(round(stt,3)*1000)
    fnn=int(round(fnn,3)*1000)
    audi=aud[pred_st:pred_ed]
    # wav_split=wav_file.split('/')[-1]
    wad=wav_name.split('.')[0]
    wav_name=wad+'_'+str(c)+'.wav'
    dest_wav_path=os.path.join(dest_all,wav_name)
    audi.export(dest_wav_path, format="wav")
    
    rate,audio=wavy.read(os.path.join(dest_all,wav_name))
    # print("rate",rate)
    # mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
    label=[]
    mfcc_feats=[]
    # print("typesss",stt,type(stt),fnn,type(fnn),p1,type(p1),p2,type(p2))
    values=list(range(stt,fnn+1,1))
    print("values",len(values),stt,pred_st,fnn,pred_ed)
    # while t1<newAudio.duration_seconds:
            # t2=t1+.01
    # for i in range(stt,0.01,fnn):
        #print(i)
    # flag=0
    if pred_st in values and pred_ed  in values:#<stt[i] and t2>stt[i]:
        print("in if")
        lb=code
        
    # print("rate",rate)
        mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
        mfcc_feats.append(mfcc_feat)

        # syl=word[i]
        # flag=1
        # break
        label.append(lb)
        return label,mfcc_feats
    elif pred_st in values and pred_ed not in values:#t1>stt[i] and t2<fnn[i]:
        print("in elif1")
        lb=code
        # syl=word[i]
        mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
        mfcc_feats.append(mfcc_feat)
        # flag=1
        # break
        label.append(lb)
        return label,mfcc_feats
    elif pred_st not in values and pred_ed in values:#t1<fnn[i] and t2>fnn[i]:
        print("in elif2")
        lb=code
        mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
        mfcc_feats.append(mfcc_feat)
        # syl=word[i]
        # flag=1
        # break
        label.append(lb)
        return label,mfcc_feats
    elif pred_st not in values and pred_ed not in values:#t1<fnn[i] and t2>fnn[i]:
        print("in elif3")
        if values[-1]<pred_ed and values[0]>pred_st:
            print("in elif3 if1 ")
            lb=code
            mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
            mfcc_feats.append(mfcc_feat)
            # flag=1
            # break
            label.append(lb)
            return label,mfcc_feats
        elif values[0]> pred_ed and values[-1]>pred_ed:
            print("in elif3 if2")
            lb=0
            mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
            mfcc_feats.append(mfcc_feat)
            # syl=word[i]
            # flag=1
            # break
            label.append(lb)
            return label,mfcc_feats
        elif values[0]<pred_st and values[-1]<pred_st:
            print("in elif3 if3")
            lb=0
            mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
            mfcc_feats.append(mfcc_feat)
            # syl=word[i]
            # flag=1
            # break
            label.append(lb)
            return label,mfcc_feats
    # if flag==0:
    #     lb=0
        # syl='None'
    # label.append(lb)       
    # return label,mfcc_feat

def chopping_extracting_feat(wav_file,excel_file,predict_bound,dest):
    st_code=3
    st,fn,code=reading_excel(excel_file,st_code)
    # (rate,sig) = wavy.read(wav_file)
    # pred_st=predict_bound[:-1]
    # pred_ed=predict_bound[1:]
    final_lab=[]
    final_feat=[]
    wav_split=wav_file.split('/')[-1]
    print("code",code)
    print(len(st),len(fn))
    newAudio = AudioSegment.from_wav(wav_file)
    # # newAudio,rate=wavy.read(wav_file)
    count=1
    # for j in range(0,len(predict_bound)-1):
    for i in range(len(st)):
        # print("code for this iteration",code[i])
        # for i in range(len(st)):
        for j in range(0,len(predict_bound)-1):
            
            lab,feat=chopping(newAudio,st[i],fn[i],code[i],predict_bound[j],predict_bound[j+1],dest,wav_split,count)
            
            final_lab.extend(lab)
            final_feat.extend(feat)
            print("final feat",len(final_feat))
            print("final lab",len(final_lab))
            # break
            count=count+1
    print("final feat",len(final_feat))
    print("final lab",len(final_lab))
    return final_lab,final_feat
    
        
def chopping2(aud,stt,fnn,code,predict_output,dest_all,wav_name,c,label,mfcc_feats):
    stt=int(round(stt,3)*1000)
    fnn=int(round(fnn,3)*1000)
    for j in range(0,len(predict_output)-1):
    # newAudio = AudioSegment.from_wav(aud)
        pred_st=int(round(predict_output[j],3)*1000)
        pred_ed=int(round(predict_output[j+1],3)*1000)
        # p1=pred_st
        # p2=pred_ed
        
        audi=aud[pred_st:pred_ed]
        # wav_split=wav_file.split('/')[-1]
        wad=wav_name.split('.')[0]
        wav_name=wad+'_'+str(c)+'.wav'
        dest_wav_path=os.path.join(dest_all,wav_name)
        audi.export(dest_wav_path, format="wav")
        
        rate,audio=wavy.read(os.path.join(dest_all,wav_name))
        # print("rate",rate)
        # mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
        # label=[]
        # mfcc_feats=[]
        # print("typesss",stt,type(stt),fnn,type(fnn),p1,type(p1),p2,type(p2))
        values=list(range(stt,fnn+1,1))
        print("values",len(values),stt,pred_st,fnn,pred_ed)
        # while t1<newAudio.duration_seconds:
                # t2=t1+.01
        # for i in range(stt,0.01,fnn):
            #print(i)
        # flag=0
        if pred_st in values and pred_ed  in values:#<stt[i] and t2>stt[i]:
            print("in if")
            lb=code
            
        # print("rate",rate)
            mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)

            # syl=word[i]
            # flag=1
            # break
            label.append(lb)
            mfcc_feats.append(mfcc_feat)
            # return label,mfcc_feat
            break
        elif pred_st in values and pred_ed not in values:#t1>stt[i] and t2<fnn[i]:
            print("in elif1")
            lb=code
            # syl=word[i]
            mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
            # flag=1
            # break
            label.append(lb)
            mfcc_feats.append(mfcc_feat)
            # return label,mfcc_feat
            break
            # return label,mfcc_feat
        elif pred_st not in values and pred_ed in values:#t1<fnn[i] and t2>fnn[i]:
            print("in elif2")
            lb=code
            mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
            # syl=word[i]
            # flag=1
            # break
            label.append(lb)
            mfcc_feats.append(mfcc_feat)
            # return label,mfcc_feat
            break
            # return label,mfcc_feat
        elif pred_st not in values and pred_ed not in values:#t1<fnn[i] and t2>fnn[i]:
            print("in elif3")
            if values[-1]<pred_ed and values[0]>pred_st:
                print("in elif3 if1 ")
                lb=code
                mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
                # flag=1
                # break
                label.append(lb)
                mfcc_feats.append(mfcc_feat)
            # return label,mfcc_feat
                break
                # return label,mfcc_feat
            elif values[0]> pred_ed and values[-1]>pred_ed:
                print("in elif3 if2")
                lb=0
                mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
                # syl=word[i]
                # flag=1
                # break
                label.append(lb)
                mfcc_feats.append(mfcc_feat)
            # return label,mfcc_feat
                break
                # return label,mfcc_feat
            elif values[0]<pred_ed and values[-1]<pred_ed:
                print("in elif3 if3")
                lb=0
                mfcc_feat=mfcc(audio,samplerate=rate,numcep=13,nfilt=26,preemph=0.97)
                # syl=word[i]
                # flag=1
                # break
                label.append(lb)
                mfcc_feats.append(mfcc_feat)
            # return label,mfcc_feat
                break
                # return label,mfcc_feat
        # if flag==0:
        #     lb=0
            # syl='None'
        # label.append(lb)       
        # return label,mfcc_feat        
            

def chopping_extracting_feat2(wav_file,excel_file,predict_bound,dest):
    st_code=3
    st,fn,code=reading_excel(excel_file,st_code)
    # (rate,sig) = wavy.read(wav_file)
    # pred_st=predict_bound[:-1]
    # pred_ed=predict_bound[1:]
    final_lab=[]
    final_feat=[]
    wav_split=wav_file.split('/')[-1]
    print("code",code)
    print(len(st),len(fn))
    newAudio = AudioSegment.from_wav(wav_file)
    # # newAudio,rate=wavy.read(wav_file)
    count=1
    # for j in range(0,len(predict_bound)-1):
    for i in range(len(st)):
        # print("code for this iteration",code[i])
        # for i in range(len(st)):
        # for j in range(0,len(predict_bound)-1):
            # labb=[]
            # mfcc_ft=[]
            chopping2(newAudio,st[i],fn[i],code[i],predict_bound,dest,wav_split,count,final_lab,final_feat)
            
            # final_lab.extend(lab)
            # final_feat.extend(feat)
            print("final feat",len(final_feat))
            print("final lab",len(final_lab))
            # break
            count=count+1
    print("final feat",len(final_feat))
    print("final lab",len(final_lab))
    return final_lab,final_feat




