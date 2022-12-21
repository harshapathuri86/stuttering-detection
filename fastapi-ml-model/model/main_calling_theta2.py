
from hashlib import new
from theta_oscillator_main import *
import scipy.io.wavfile as wavy
from feat_extr_nn2 import *

def reading_dir(labels_path,wave_path):
  folder=os.listdir(labels_path)    
  wav_list=[]
  for file in folder:
      # print("file name",file)
      flag=0
      ff = file.split(".")[0]
      # print("ff",ff)
      
      
      
      df = pd.read_excel(labels_path+file)
      wav=wave_path+ff+".wav"
      # newAudio = AudioSegment.from_wav(wav)
      # time=newAudio.duration_seconds
      # tot_duration+=time
      # t1=0
      stt=[]
      fnn=[]
      # print("stutter codes",type(df.Stutter_code))
      for index, row in df.iterrows():
          # syll_name_list.append(row['Syllables'])
          # if row['Stutter_code']==stutter_code:
              stt.append(row['Start_time'])
              fnn.append(row['End_time'])
              # word.append(row['Syllables'])
      (rate,sig) = wavy.read(wav)
  return stt,fnn,rate,sig
def plotting(s,f,wav,fs):
  pl.figure(figsize=(18,8))
  time_axis = [i*1./fs for i in range(len(wav))]
  pl.plot(time_axis, wav)
  pl.xlim((-0.01, (len(wav))*1./fs+0.01))
  # time_axis = [i*1./1000 for i in range(len(outh))]
  # pl.plot(time_axis, outh)
  
  for vi in f:
      pl.axvline(vi, ymin=0, ymax=1, color='r', linestyle='dashed')

  # for vi in s:
  #     pl.axvline(vi, ymin=0, ymax=1, color='b', linestyle='dashed')  
    
  ## Plot syll nuclei
  # for pi in peak_indices:
  #     pl.axvline(pi*1./1000, ymin=0, ymax=1, color = 'g', linestyle='dashed')

  ## Plot true boundaries
  # zz = [0, 0.264, 0.446, 0.573, 0.7854];
  # for z in zz:
  #    pl.axvline(z, ymin=0, ymax=1, color = 'k', linestyle='dashed')
      
      
  pl.legend(['signal', 'sonority', 'estimated syll boundaries']);
  pl.title('Theta oscillator based syllable boundary detection');
  pl.xlabel ('Time [s]')
#   pl.show()


def boundaries_original(csv_file,wav_file,dire,label_path,wav_path):
  if dire:
    stt,end,rate,sig=reading_dir(label_path,wav_path)
    return stt,end
  else:
    df = pd.read_excel(csv_file)
    stt=[]
    fnn=[]
    # print("stutter codes",type(df.Stutter_code))
    for index, row in df.iterrows():
        # syll_name_list.append(row['Syllables'])
        # if row['Stutter_code']==stutter_code:
            stt.append(row['Start_time'])
            fnn.append(row['End_time'])
    print(len(stt),len(fnn))
    (rate,sig) = wavy.read(wav_file)
    plotting(stt,fnn,sig,rate)
    return stt,fnn

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

   




# wa1='/content/gdrive/MyDrive/aiish_04_08/old_wav_resamp/sneha_bengaluru_4.wav'
# wa2='/content/gdrive/MyDrive/aiish_04_08/old_wav_resamp/sneha_bengaluru_1.wav'
#original values
minfreq = 50   #100    #50
maxfreq = 7500   #5000    #7500
bands = 10      #10    #20
Q_value = 0.8;  # Q-value of the oscillator, default = 0.5 = critical damping
center_frequency = 5; # in Hz
threshold = 0.025;
N_bands=30

excel_path=''
waves_path=''
# excel_file='/home/vamshi/Videos/theta_exp/old_excel_files/nithin_bengaluru_1.xlsx'
# wave_file='/home/vamshi/Videos/theta_exp/old_wav_resamp/nithin_bengaluru_1.wav'
excel_file='/home/north/Videos/theta_experiments/old_excel_files/nithin_bengaluru_1.xlsx'
wave_file='/home/north/Videos/theta_experiments/old_wav_resamp/nithin_bengaluru_1.wav'
chopped_dest='/home/north/Videos/theta_experiments/chopped_audios/'
dire=0
st_list,end_list=boundaries_original(excel_file,wave_file,0,excel_path,waves_path)
print("start len",len(st_list),"end len",len(end_list))
pks,vals,val_ind=theta_oscillator_main(wave_file,minfreq,maxfreq,bands,Q_value,center_frequency,threshold,N_bands,end_list,st_list)
print("pks len",len(pks),"vals len",len(vals),"val_ind len",len(val_ind))
# st_list,end_list=boundaries_original(excel_file,wave_file,0,excel_path,waves_path)
val_ind=val_ind/1000
# print(val_ind)


final_bound=changing_count_peakvalues(val_ind,0.2,end_list)

print(len(final_bound))
print("final_bound",final_bound)
print("end_list",end_list)

lab,feat=chopping_extracting_feat(wave_file,excel_file,final_bound,chopped_dest)
# chopping_extracting_feat(wave_file,excel_file,final_bound,chopped_dest)

print("lab",lab)
print("feat",len(feat),np.shape(feat))
co=0
for i in range(len(feat)):
    print("lenghs",np.shape(feat[i]))
    if co==5:
        break
    co=co+1
