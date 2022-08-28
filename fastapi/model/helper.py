import os
import sys
import scipy.io.wavfile as wavy
import numpy as np
from python_speech_features import mfcc
from python_speech_features import delta
import pickle


def load_model():
    try:
        model = pickle.load(open('model/mfcc_mod1', 'rb'))
    except Exception as e:
        print(e)
        sys.exit(1)
    return model


def cerating_arrays_1(final_featf):
    # print("lab len",len(final_labf),final_labf.count(code))
    X = []
    if len(final_featf) > 0:
        for i in range(len(final_featf)):
            X.append(final_featf[i])
    X = np.array(X)
    print("len of X,y", len(X), "shapes", np.shape(X))
    return X


def feat_extract_wav(wave_file):
    mfcc_fi = []
    # sdc_fi=[]

    (rate, sig) = wavy.read(wave_file)
    sig = sig - np.mean(sig)

    # if feature_code=='mfcc'
    try:
        mfcc_feat = mfcc(sig, rate, numcep=13, nfilt=40, preemph=0.97)
    except:
        print("aaaaa in exception")
    if len(mfcc_feat) > 0:
        # print("name",name)
        mfcc_d = delta(mfcc_feat, 1)
        mfcc_dd = delta(mfcc_d, 1)
        feat = np.concatenate((mfcc_feat, mfcc_d, mfcc_dd), axis=1)

        # sdc_feat=shifted_delta_cepstral(mfcc_feat)

        for i in range(3, len(feat)-3):
            args = (feat[i-3], feat[i-2], feat[i-1],
                    feat[i], feat[i+1], feat[i+2], feat[i+3])
            xt = []
            xt = np.concatenate(args)
            mfcc_fi.append(xt)  # feat[k])

        # for j in range(len(sdc_feat)):
        #     sdc_fi.append(sdc_feat[j])

    return mfcc_fi


def run_model(model, audio):
    mfc_raj_1 = feat_extract_wav(audio)
    print(np.shape(mfc_raj_1))
    xarr_test = cerating_arrays_1(mfc_raj_1)
    yhat_classess = (model.predict(xarr_test) > 0.5).astype("int16")
    yhat_classess = yhat_classess[:, 0]
    print(yhat_classess)

    print(len(yhat_classess))
    # count ones in yhat_classess
    c_1 = np.count_nonzero(yhat_classess)
    c_0 = len(yhat_classess) - c_1
    print("c_1", c_1, "c_0", c_0)
    return c_1, c_0
