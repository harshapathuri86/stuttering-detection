# import xlsxwriter
import pandas as pd
import openpyxl


# def writing_excel_file(w_name,s_name,pred_bound,fin_bound):
#     st_len=[]
#     pred_bound_len=[]
#     fin_bound_len=[]
#     for i in range(len(w_name)):
#         st_len.append(len(s_name[i]))
#         pred_bound_len.append(len(pred_bound[i]))
#         fin_bound_len.append(len(fin_bound[i]))

#     df=pd.DataFrame([w_name,st_len,pred_bound_len,fin_bound_len],columns=['wave_name','original_count_of_syllables','predicted_count_of_syllables','final_predicted_count_of_syaalbales'])
#     df.to_excel('excel_original_predicted_boundaries.xlsx')
#     return 0  
    # import xlsxwriter module     
import xlsxwriter     
        
book = xlsxwriter.Workbook('sample_stutter_my_val.xlsx')     
sheet = book.add_worksheet()     
def writing_val_list(val_list,row,column,num):
    if num and column==0:
        for i in val_list:
            # print("inside if")
            sheet.write(row, column, i)
            row += 1
    elif num and column>0 and column!=4 and column!=5 and column!=6:
        for i in val_list:
            # print("inside if")
            sheet.write(row, column, len(i))
            row += 1
    elif column==4 or column==5 or column==6:
        for i in val_list:
            sheet.write(row,column,str(i))
            row=row+1
    else:
        for i in val_list:
            # print("inside else")
            sheet.write(row, column, i)
            column += 1

def al_list_wrting(comb_list):
    row=0
    column=0
    num=0
    print("lll",len(comb_list))
    for i in range(len(comb_list)):
        # print("comb list i",comb_list[i])
        if i==0 or i==1:
            # print("col if ",column)
            writing_val_list(comb_list[i],row,column,num)
            row=1
            num=1
        else:
            row=1
            num=1
            column=column+1
            # print("col",column)
            writing_val_list(comb_list[i],row,column,num)
            
            
    


# content=['wave_name','original_count_of_syllables','predicted_count_of_syllables','final_predicted_count_of_syaalbales']      
# w_name=['asdf','ertg','kldmd','zxcv']
# s_name=[[0.1,0.2,0.3,0.1],[0.4,0.5,0.6,0.4],[0.7,0.8,0.9,0.7],[0.4,0.5,0.6,0.4]]
# pred_bound=[[1.1,1.2,1.3,1.2],[1.4,1.5,1.6,1.7],[1.7,1.8,1.9,1.7],[0.4,0.5,0.6,0.4]]
# fin_bound=[[2.1,2.2,2.3,2.1],[2.4,2.5,2.6,2.3],[2.7,2.8,2.9,2.4],[0.4,0.5,0.6,0.4]]
# writing_excel_file(w_name,s_name,pred_bound,fin_bound)
# asdf=[]
# asdf.append(content)
# asdf.append(w_name)
# asdf.append(s_name)
# asdf.append(pred_bound)
# asdf.append(fin_bound)
# al_list_wrting(asdf)
# book.close()