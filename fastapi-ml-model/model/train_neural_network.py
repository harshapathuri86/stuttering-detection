import os
import numpy as np
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix,ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import tensorflow as tf
import keras
from keras.layers import Input, Add, Dense, Activation, ZeroPadding2D, BatchNormalization, Flatten, Conv2D, AveragePooling2D, MaxPooling2D, GlobalMaxPooling2D,Embedding,Bidirectional,LSTM
from keras.models import Model, load_model, Sequential
from imblearn.over_sampling import SMOTE 
from sklearn import svm
from keras import regularizers


def making_x_y(lab_list,feat_list):
    X=[]
    Y=[]
    for i in range(len(feat_list)):
        for j in range(len(feat_list[i])):
            X.extend(feat_list[i][j])
            for k in range(len(feat_list[i][j])):
                Y.append(lab_list[i][j])
    print("len of x,y",len(X),len(Y),np.shape(X),np.shape(Y))
    return X,Y
def making_Y_stutter_code(y_list,st_code):
    y_arr=[]
    for i in range(len(y_list)):
        if y_list[i]==st_code:
            y_arr.append(1)
        else:
            y_arr.append(0)
    return y_arr
    


def model_creation(inp_shape):
  model = Sequential()
  model.add(Input(shape=(inp_shape,)))
#   model.add(Dense(30, activation='sigmoid'))
  model.add(Dense(5, activation='sigmoid'))
  model.add(Dense(3, activation='sigmoid'))
  # model.add(Dense(2, activation='sigmoid'))
  model.add(Dense(1, activation='sigmoid',kernel_regularizer=regularizers.l2(0.001)))
  # model.add(Dense(1, activation='sigmoid'))
  opt = tf.keras.optimizers.SGD(learning_rate=0.005)
  model.compile(optimizer=opt, loss='binary_crossentropy', metrics=['accuracy'])
  return model

def smoothe(xa,ya):
  print(len(xa),len(ya))
  sm = SMOTE()#sampling_strategy=0.3 
  # X=np.array(X)
  # y=np.array(y)
  X_sm, y_sm = sm.fit_resample(xa, ya)
  print(len(X_sm),len(y_sm))

  cn=0
  for i in range(len(y_sm)):
    if y_sm[i]==1:
      cn+=1
  print(cn)
  from collections import Counter
  counter = Counter(y_sm)
  print(counter)
  return X_sm,y_sm
def split(X_sm,y_sm,size_samp):
  X_trainsm, X_testsm, y_trainsm, y_testsm = train_test_split(X_sm,y_sm, test_size=size_samp)
  return X_trainsm, X_testsm, y_trainsm, y_testsm
def confusion_mat(y_t,yhat):
  print(confusion_matrix(y_t,yhat))
  cm = confusion_matrix(y_t,yhat)
  disp = ConfusionMatrixDisplay(confusion_matrix=cm)
  disp.plot()
  plt.show()


# from sklearn.model_selection import train_test_split
def svm_classifier():
    
  clf = svm.SVC(kernel='rbf',C=0.025)
  return clf

    




