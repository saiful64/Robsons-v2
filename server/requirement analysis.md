Form 1: Obs Index -> Primi, Multi
Form 2: Weeks -> 20-35,	35<40, >=40 
Form 3: POG -> <36, >36 
Form 4: Single/Twins -> Single, Multiple
Form 5: Previous Cesarean -> 0,1,2,3
Form 6: Present -> Vertex/Cephalic, Breech, Others 
Form 7: Labour -> Pre Labour, Spontaneous, Induced
	On selecting Pre labour, form 8 has to be displayed
	On selecting Spontaneous, form 10 has to be displayed
	On selecting Induced, form 8 has to be displayed

Form 8: Ripening -> F , EASI , PGE1, PGE2 gel, Propess, Combina, Oxytoxin, ARM, Oxyto , others
Form 9: Induction -> ARM, Oxyto, Others
Form 10:Delivery -> SVD, Vacuum, Forceps, CS, V-LF
Form 11:IndOVD -> Fetal dist, Prol.sec, Mat.exha, Others
Form 12:IndCS -> Fail.Ind , Fail.ECV, Doubt.Scar, Scardehi, Rupture, Mat.ind, Abruption , Place.pre, MAP, CPD, CP, Failed Ripe, Fetal dist, Breech, Others
Form 13: Stage -> I Stage, II Stage
Form 14: Baby Details-> Gender->Female, Male, Ind.sex 
        Birth date, Birth Time-> Hour/Min/AM-PM
Form 15:Weight -> <1000gm, 1-1.5 , 1.5-2 , 2-2.5, 2.5-3.5 , 3.5-4, >=4, >=5
Form 16:APGAR -> At 1 min (text box), At 5 min (text box)
Form 17:Outcome -> M/S, LR, NICV, SB
Form 18:Indication -> Res. dis, Low APGAR, Preterm , Others
Form 19: Final Outcome -> HIEI , HIEIII, M/S, Expired, LAMA, Sepsis
Form 20: Indication for Induction -> Past Dates,Oligo, FGR, PE, GDM/DM, PROM, IUFD, RED FM, APH, POLYHYD, IHCP, AFLP, Unstable Lie, RH Neg, Others
Form 21: Go to Home Page, Generate Excel sheet, Generate Status, Log out


>>>
{
    "formData": [
        { "title":"obs_index",
        "displayText": "Obs Index", 
        "options": [
            {"value":"primi", "displayText": "Primi"}, 
            {"value":"multi", "displayText": "Multi"}
        ], 
        "showPrevious": false, 
        "showNext": true },
        
        { "title":"weeks",
        "displayText": "Weeks", 
        "options": [
            {"value":"20-35", "displayText": "20-35"},
            {"value":"35<40", "displayText": "35<40"},
            {"value":">=40", "displayText": ">=40"}
        ], 
        "showPrevious": true, 
        "showNext": true },
        
        { "title":"pog",
        "displayText": "POG", 
        "options": [
            {"value":"<36", "displayText": "<36"},
            {"value":">36", "displayText": ">36"}
        ], 
        "showPrevious": true, 
        "showNext": true },
        
        { 
            "title":"single_twins",
            "displayText": "Single/Twins", 
            "options": [
                {"value":"single", "displayText": "Single"}, 
                {"value":"multiple", "displayText": "Multiple"}
            ], 
            "showPrevious": true, 
            "showNext": true 
        },
        
        { 
            "title":"previous_cesarean",
            "displayText": "Previous Cesarean", 
            "options": [
                {"value":"0", "displayText": "0"},
                {"value":"1", "displayText": "1"},
                {"value":"2", "displayText": "2"},
                {"value":"3", "displayText": "3"}
            ], 
            "showPrevious": true, 
            "showNext": true 
        },
        
        { 
            "title":"present",
            "displayText": "Present", 
            "options": [
                {"value":"vertex_cephalic", "displayText": "Vertex/Cephalic"},
                {"value":"breech", "displayText": "Breech"},
                {"value":"others", "displayText": "Others"}
            ], 
            "showPrevious": true, 
            "showNext": true 
        },
        
        {
          "title": "Labour",
          "displayText": "Select Labour Type",
          "options": [
            {"value": "pre_labour", "displayText": "Pre Labour"},
            {"value": "spontaneous", "displayText": "Spontaneous"},
            {"value": "induced", "displayText": "Induced"}
          ],
          "showPrevious": true,
          "showNext": true,
          "conditions": [
            {
              "option": "spontaneous",
              "target": "delivery"
            }
          ]
        },
        
        { 
            "title":"ripening",
            "displayText": "Ripening", 
            "options": [
                {"value":"f", "displayText": "F"},
                {"value":"easi", "displayText": "EASI"},
                {"value":"pge1_gel", "displayText": "PGE1 gel"},
                {"value":"pge2_gel", "displayText": "PGE2 gel"},
                {"value":"propess", "displayText": "Propess"},
                {"value":"combina", "displayText": "Combina"},
                {"value":"oxytoxin", "displayText": "Oxytoxin"},
                {"value":"arm", "displayText": "ARM"},
                {"value":"oxyto", "displayText": "Oxyto"},
                {"value":"others", "displayText": "Others"}
            ], 
            "showPrevious": true, 
            "showNext": true 
        },
        
        { 
            "title":"induction",
            "displayText": "Induction", 
            "options": [
                {"value":"arm", "displayText": "ARM"},
                {"value":"oxyto", "displayText": "Oxyto"},
                {"value":"others", "displayText": "Others"}
            ], 
            "showPrevious": true, 
            "showNext": true 
        },
        
        { 
            "title":"delivery",
            "displayText": "Delivery", 
            "options": [
                {"value":"svd", "displayText": "SVD"},
                {"value":"vacuum", "displayText": "Vacuum"},
                {"value":"forceps", "displayText": "Forceps"},
                {"value":"cs", "displayText": "CS"},
                {"value":"v-lf", "displayText": "V-LF"}
            ], 
            "showPrevious": true, 
            "showNext": true 
        },
          {
            "title": "indeovp",
            "displayText": "IndeOVP",
            "options": [
              {"value": "fetal_distress", "displayText": "Fetal distress"},
              {"value": "prof_sec", "displayText": "Protracted second stage"},
              {"value": "mat_exha", "displayText": "Maternal exhaustion"},
              {"value": "others", "displayText": "Others"}
            ],
            "showPrevious": true,
            "showNext": true
          },
          {
            "title": "IndeCS",
            "displayText": "IndeCS",
            "options": [
            {"value": "fail_ind", "displayText": "Failed induction"},
            {"value": "fail_ecv", "displayText": "Failed ECV"},
            {"value": "doubt_scar", "displayText": "Doubtful scar"},
            {"value": "scardehi", "displayText": "Scar dehiscence"},
            {"value": "rupture", "displayText": "Rupture uterus"},
            {"value": "mat_ind", "displayText": "Maternal indication"},
            {"value": "abruption", "displayText": "Abruptio placentae"},
            {"value": "place_pre", "displayText": "Placenta previa"},
            {"value": "map", "displayText": "Multiple pregnancy"},
            {"value": "cpd", "displayText": "Cephalopelvic disproportion"},
            {"value": "cp", "displayText": "Cord prolapse"},
            {"value": "failed_ripe", "displayText": "Failed to ripen cervix"},
            {"value": "fetal_dist", "displayText": "Fetal distress"},
            {"value": "breech", "displayText": "Breech presentation"},
            {"value": "others", "displayText": "Others"}
            ],
            "showPrevious": true,
            "showNext": true
            },
            
            {
            "title": "Stage",
            "displayText": "Stage",
            "options": [
            {"value": "i_stage", "displayText": "I Stage"},
            {"value": "ii_stage", "displayText": "II Stage"}
            ],
            "showPrevious": true,
            "showNext": true
            },
            
            {
            "title": "BabyDetails",
            "displayText": "Baby Details",
            "options": [
            {"value": "female", "displayText": "Female","type":"dateAndTimePicker"},
            {"value": "male", "displayText": "Male","type":"dateAndTimePicker"},
            {"value": "ind_sex", "displayText": "Indeterminate sex","type":"dateAndTimePicker"}
            ],
            "dateOfBirth": "",
            "timeOfBirth": "",
            "dateAndTimePicker": true,
            "showPrevious": true,
            "showNext": true
            },
            {
              "title": "weight",
              "displayText": "Weight (kg)",
              "options": [
              {"value": "<1", "displayText": "<1000gm"},
              {"value": "1-1.5", "displayText": "1-1.5 kg"},
              {"value": "1.5-2", "displayText": "1.5-2 kg"},
              {"value": "2-2.5", "displayText": "2-2.5 kg"},
              {"value": "2.5-3.5", "displayText": "2.5-3.5 kg"},
              {"value": "3.5-4", "displayText": "3.5-4 kg"},
              {"value": ">=4", "displayText": ">=4 kg"},
              {"value": ">=5", "displayText": ">=5 kg"}
              ],
              "showPrevious": true,
              "showNext": true
              },
              {"title": "apgar",
              "displayText": "APGAR",
              "options": [
              {"value": "at_1_min", "displayText": "At 1 min","type":"textBox"},
              {"value": "at_5_min", "displayText": "At 5 min","type":"textBox"}
              ],
              "showPrevious": true,
              "showNext": true},
              {
              "title": "outcome",
              "displayText": "Outcome",
              "options": [
              {"value": "m_s", "displayText": "M/S"},
              {"value": "lr", "displayText": "LR"},
              {"value": "nicv", "displayText": "NICV"},
              {"value": "sb", "displayText": "SB"}
              ],
              "showPrevious": true,
              "showNext": true
              },
              {
              "title": "indication",
              "displayText": "Indication",
              "options": [
              {"value": "res_dis", "displayText": "Respiratory distress"},
              {"value": "low_apgar", "displayText": "Low APGAR"},
              {"value": "preterm", "displayText": "Preterm"},
              {"value": "others", "displayText": "Others"}
              ],
              "showPrevious": true,
              "showNext": true
              },
              {
              "title": "final_outcome",
              "displayText": "Final Outcome",
              "options": [
              {"value": "hiei", "displayText": "HIE I"},
              {"value": "hieiii", "displayText": "HIE III"},
              {"value": "m_s", "displayText": "M/S"},
              {"value": "expired", "displayText": "Expired"},
              {"value": "lama", "displayText": "LAMA"},
              {"value": "sepsis", "displayText": "Sepsis"}
              ],
              "showPrevious": true,
              "showNext": true
              },
              {
                "title": "indication_for_induction",
                "displayText": "Indication for Induction",
                "options": [
                  {"value": "past_dates", "displayText": "Past Dates"},
                  {"value": "oligo", "displayText": "Oligo"},
                  {"value": "fgr", "displayText": "FGR"},
                  {"value": "pe", "displayText": "PE"},
                  {"value": "gdm_dm", "displayText": "GDM/DM"},
                  {"value": "prom", "displayText": "PROM"},
                  {"value": "iufd", "displayText": "IUFD"},
                  {"value": "red_fm", "displayText": "RED FM"},
                  {"value": "aph", "displayText": "APH"},
                  {"value": "polyhyd", "displayText": "POLYHYD"},
                  {"value": "ihcp", "displayText": "IHCP"},
                  {"value": "unstable_lie", "displayText": "Unstable Lie"},
                  {"value": "rh_neg", "displayText": "RH Neg"},
                  {"value": "others", "displayText": "Others"}
                ],
                "showPrevious": true,
                "showNext": false
              }              
      ] 
}