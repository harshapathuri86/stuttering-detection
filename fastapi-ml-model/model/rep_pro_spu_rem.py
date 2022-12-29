import numpy as np

def removing_spurious_peaks(original_array,pks_val,valley_ind_vals):
  final_valley_points=[]
  final_pks_points=[]
  index_list=[]
  for k in range(len(valley_ind_vals)):
    final_valley_points.append(valley_ind_vals[k])
  for j in range(len(pks_val)):
    final_pks_points.append(pks_val[j])
  # final_valley_points=valley_ind_vals.copy()
  # final_pks_points=pks_val.copy()
  # print("len",len(valley_ind_vals),len(pks_val))
  nk=len(valley_ind_vals)-1
  for i in range(nk):
  
    try:
      # print("values in bb",original_array[valley_ind_vals[i]],"index value in bb",valley_ind_vals[i])
      if original_array[valley_ind_vals[i]]<=0.1 and original_array[valley_ind_vals[i+1]]<=0.1:
        # valley_ind_vals.pop(i+1)
        final_valley_points.pop(i+1)
        final_pks_points.pop(i+1)
        index_list.append(i+1)
        # print("removed index bb",valley_ind_vals[i+1],"value",original_array[valley_ind_vals[i+1]])
      else:
        continue
    except: 
      print("some went wrong spurous peaks",valley_ind_vals[i])

  return final_pks_points,final_valley_points,valley_ind_vals,index_list
def for_repetation1(original_array,pks_val,valley_ind_vals):
  final_valley_points=[]
  final_pks_points=[]
  index_list=[]
  for k in range(len(valley_ind_vals)):
    final_valley_points.append(valley_ind_vals[k])
  for j in range(len(pks_val)):
    final_pks_points.append(pks_val[j])
  # final_valley_points=valley_ind_vals.copy()
  # final_pks_points=pks_val.copy()
  # print("len",len(valley_ind_vals),len(pks_val))
  nk=len(valley_ind_vals)-1
  for i in range(nk):
  
    try:
      diff=np.abs(valley_ind_vals[i]-valley_ind_vals[i+1])
      diff=round(diff,3)
      # diff_list.append(diff)
      if diff<=150:
      # print("values in bb",original_array[valley_ind_vals[i]],"index value in bb",valley_ind_vals[i])
      # if original_array[valley_ind_vals[i]]<=0.1 and original_array[valley_ind_vals[i+1]]<=0.1:
        # valley_ind_vals.pop(i+1)
        final_valley_points.pop(i+1)
        final_pks_points.pop(i+1)
        index_list.append(i+1)
        # print("removed index bb",valley_ind_vals[i+1],"value",original_array[valley_ind_vals[i+1]])
      else:
        continue
    except: 
      print("some went wrong repetation",valley_ind_vals[i],diff)

  return final_pks_points,final_valley_points,valley_ind_vals,index_list
def for_prolongation(original_array,pks_val,valley_ind_vals):
  final_valley_points=[]
  final_pks_points=[]
  index_list=[]
  for k in range(len(valley_ind_vals)):
    final_valley_points.append(valley_ind_vals[k])
  for j in range(len(pks_val)):
    final_pks_points.append(pks_val[j])
 
  # final_valley_points=valley_ind_vals.copy()
  # final_pks_points=pks_val.copy()
  # print("len of both in prolomg",len(pks_val),len(valley_ind_vals))
  nl=len(pks_val)-1
  for i in range(nl):
      # print("i values ",i,"index i",pks_val[i])
    # try:
      # print("pks val",pks_val)
      # print("values",original_array[pks_val[i]],"index value",pks_val[i])
      diff=np.abs(original_array[pks_val[i]]-original_array[pks_val[i+1]])
      # print("index value",pks_val[i],"index value +1",pks_val[i+1],"diff",diff)
      if diff>0.02:
        # valley_ind_vals.pop(i+1)
        continue

      #   print("removed index pp",valley_ind_vals[i+1],"value",original_array[valley_ind_vals[i+1]])
      else:
        # print("index i",pks_val[i],"index i+1",pks_val[i+1],"diff",diff,"i val",i,"i+1 val",i+1)
        final_valley_points.pop(i+1)
        # print("final valley points at i",final_valley_points)
        index_list.append(i+1)
        final_pks_points.pop(i+1)
        # print("final pks points at i",final_pks_points)
        

        
    # except: 
    #   print("some went wrong in pro",pks_val[i],original_array[pks_val[i]])
  # print("pks final lne",len(final_pks_points),"final val points",len(final_valley_points),index_list)
  return final_pks_points,final_valley_points,valley_ind_vals,index_list
def removing_indexes_for_all_types(index_value_list,original_index_pk_list,original_index_val_list):
  if len(index_value_list)>0:
    pks=[]
    vals=[]
    for i in index_value_list:
      pks.append(original_index_pk_list[i])
      vals.append(original_index_val_list[i])
      # print("pks",pks,"val",vals)
    for i in range(len(pks)):  
      original_index_pk_list.remove(pks[i])
      original_index_val_list.remove(vals[i])

      # original_index_pk_list.pop(i)
      # original_index_val_list.pop(i)
    return original_index_pk_list,original_index_val_list
  else:
    return original_index_pk_list,original_index_val_list


