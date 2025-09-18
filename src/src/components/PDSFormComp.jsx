import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PDSForm = () => {
  const { register, handleSubmit } = useForm();
  const wrapperRef = useRef();

  const onSubmit = (data) => {
    console.log("PDS form data:", data);
    alert("PDS saved (console).");
  };

  const handleDownloadPDF = async () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const pages = wrapper.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < pages.length; i++) {
      // render each page separately
      const canvas = await html2canvas(pages[i], { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      if (i !== 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save("PDS_Form_Full.pdf");
  };

  return (
    <div>
      {/* Scrollable wrapper that html2canvas will query for .page nodes */}
      <div ref={wrapperRef} className="pds-form-wrapper" style={{
          maxHeight: "85vh",
          overflowY: "auto",
          overflowX: "auto",
          padding: "12px",
          background: "#f4f6f8",
          border: "1px solid #ddd"
        }}>
        <form onSubmit={handleSubmit(onSubmit)} className="pds-form">
          {/* ================= PAGE 1 ================= */}
          <div className="page" style={{
              width: "100%",
              minHeight: "297mm",
              background: "white",
              padding: "18px",
              boxSizing: "border-box",
              marginBottom: "20px",
              boxShadow: "0 0 6px rgba(0,0,0,0.06)"
            }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>CS FORM No. 212 (Revised 2017)</div>
              <div style={{ fontWeight: 700 }}>PERSONAL DATA SHEET</div>
            </div>

            {/* WARNING & NOTE can be static text if you want */}
            <div style={{ fontSize: 12, marginBottom: 12 }}>
              <strong>WARNING:</strong> Any misrepresentation made in the Personal Data Sheet...
            </div>

            {/* 1. CS ID No */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12 }}>1. CS ID No. <small style={{ color:"#666" }}>(Do not fill up. For CSC use only)</small></label>
              <input {...register("csIdNo")} style={{ width: "220px", display:"block", padding:"6px", marginTop:4 }} />
            </div>

            {/* I. PERSONAL INFORMATION */}
            <h4 style={{ margin: "12px 0 8px" }}>I. PERSONAL INFORMATION</h4>

            {/* 2. Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 200px", gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 12 }}>2. SURNAME</label>
                <input {...register("surname")} style={{ width: "100%", padding:6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12 }}>FIRST NAME</label>
                <input {...register("firstName")} style={{ width: "100%", padding:6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12 }}>MIDDLE NAME</label>
                <input {...register("middleName")} style={{ width: "100%", padding:6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12 }}>NAME EXTENSION (JR., SR.)</label>
                <input {...register("nameExt")} style={{ width: "100%", padding:6 }} />
              </div>
            </div>

            {/* 3 & 4: DOB & Place of birth */}
            <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 12 }}>3. DATE OF BIRTH (mm/dd/yyyy)</label>
                <input type="date" {...register("dateOfBirth")} style={{ width: "100%", padding:6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12 }}>4. PLACE OF BIRTH</label>
                <input {...register("placeOfBirth")} style={{ width: "100%", padding:6 }} />
              </div>
            </div>

            {/* Citizenship, Sex, Civil status */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize: 12 }}>16. CITIZENSHIP</label>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:6 }}>
                  <label><input type="radio" value="Filipino" {...register("citizenship")} /> Filipino</label>
                  <label><input type="radio" value="Dual" {...register("citizenship")} /> Dual Citizenship</label>
                  <div style={{ marginLeft:6 }}>
                    <small style={{ color:"#666" }}>If dual: <input {...register("dual_details")} placeholder="country / how" style={{ padding:4, marginLeft:6 }} /></small>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12 }}>5. SEX</label>
                <div style={{ display:"flex", gap:12, marginTop:6 }}>
                  <label><input type="radio" value="Male" {...register("sex")} /> Male</label>
                  <label><input type="radio" value="Female" {...register("sex")} /> Female</label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12 }}>6. CIVIL STATUS</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  <label><input type="radio" value="Single" {...register("civilStatus")} /> Single</label>
                  <label><input type="radio" value="Married" {...register("civilStatus")} /> Married</label>
                  <label><input type="radio" value="Widowed" {...register("civilStatus")} /> Widowed</label>
                  <label><input type="radio" value="Separated" {...register("civilStatus")} /> Separated</label>
                  <label>Other: <input {...register("civilStatusOther")} style={{ padding:4, marginLeft:6 }} /></label>
                </div>
              </div>
            </div>

            {/* Height / Weight / Blood Type */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize:12 }}>7. HEIGHT (m)</label>
                <input {...register("height")} placeholder="e.g., 1.65" style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>8. WEIGHT (kg)</label>
                <input {...register("weight")} placeholder="e.g., 60" style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>9. BLOOD TYPE</label>
                <input {...register("bloodType")} style={{ padding:6, width:"100%" }} />
              </div>
            </div>

            {/* IDs (10-15), Contacts (19-21) */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize:12 }}>10. GSIS ID NO.</label>
                <input {...register("gsis")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>11. PAG-IBIG ID NO.</label>
                <input {...register("pagibig")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>12. PHILHEALTH NO.</label>
                <input {...register("philhealth")} style={{ padding:6, width:"100%" }} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize:12 }}>13. SSS NO.</label>
                <input {...register("sss")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>14. TIN NO.</label>
                <input {...register("tin")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>15. AGENCY EMPLOYEE NO.</label>
                <input {...register("agencyEmployeeNo")} style={{ padding:6, width:"100%" }} />
              </div>
            </div>

            {/* Address blocks: Residential (17) and Permanent (18) */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:8 }}>
              {/* RESIDENTIAL ADDRESS */}
              <div style={{ border:"1px solid #e3e3e3", padding:8 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>17. RESIDENTIAL ADDRESS</div>
                <div style={{ marginTop:8, display:"grid", gap:6 }}>
                  <input {...register("res_houseNo")} placeholder="House/Block/Lot No." style={{ padding:6 }} />
                  <input {...register("res_street")} placeholder="Street" style={{ padding:6 }} />
                  <input {...register("res_subdivision")} placeholder="Subdivision/Village" style={{ padding:6 }} />
                  <input {...register("res_barangay")} placeholder="Barangay" style={{ padding:6 }} />
                  <div style={{ display:"flex", gap:8 }}>
                    <input {...register("res_city")} placeholder="City/Municipality" style={{ padding:6, flex:1 }} />
                    <input {...register("res_province")} placeholder="Province" style={{ padding:6, width:200 }} />
                    <input {...register("res_zip")} placeholder="ZIP CODE" style={{ padding:6, width:120 }} />
                  </div>
                </div>
              </div>

              {/* PERMANENT ADDRESS */}
              <div style={{ border:"1px solid #e3e3e3", padding:8 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>18. PERMANENT ADDRESS</div>
                <div style={{ marginTop:8, display:"grid", gap:6 }}>
                  <input {...register("perm_houseNo")} placeholder="House/Block/Lot No." style={{ padding:6 }} />
                  <input {...register("perm_street")} placeholder="Street" style={{ padding:6 }} />
                  <input {...register("perm_subdivision")} placeholder="Subdivision/Village" style={{ padding:6 }} />
                  <input {...register("perm_barangay")} placeholder="Barangay" style={{ padding:6 }} />
                  <div style={{ display:"flex", gap:8 }}>
                    <input {...register("perm_city")} placeholder="City/Municipality" style={{ padding:6, flex:1 }} />
                    <input {...register("perm_province")} placeholder="Province" style={{ padding:6, width:200 }} />
                    <input {...register("perm_zip")} placeholder="ZIP CODE" style={{ padding:6, width:120 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:8 }}>
              <div>
                <label style={{ fontSize:12 }}>19. TELEPHONE NO.</label>
                <input {...register("telephone")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>20. MOBILE NO.</label>
                <input {...register("mobile")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>21. E-MAIL ADDRESS (if any)</label>
                <input {...register("email")} style={{ padding:6, width:"100%" }} />
              </div>
            </div>

            {/* II. FAMILY BACKGROUND */}
            <h4 style={{ marginTop: 18 }}>II. FAMILY BACKGROUND</h4>

            {/* Spouse */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize:12 }}>22. SPOUSE'S SURNAME</label>
                <input {...register("spouse_surname")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>FIRST NAME</label>
                <input {...register("spouse_first")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>MIDDLE NAME</label>
                <input {...register("spouse_middle")} style={{ padding:6, width:"100%" }} />
              </div>
            </div>

            {/* Children (multiple rows) */}
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:12 }}>23. NAME OF CHILDREN (Write full name and list all) — DATE OF BIRTH (mm/dd/yyyy)</label>
              <div style={{ marginTop:6 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                    <input {...register(`child_${i}_name`)} placeholder={`Child ${i+1} full name`} style={{ flex:1, padding:6 }} />
                    <input type="date" {...register(`child_${i}_dob`)} style={{ width:160, padding:6 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Father & Mother */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div>
                <label style={{ fontSize:12 }}>24. FATHER'S SURNAME / FIRST NAME / MIDDLE NAME / NAME EXTENSION (JR., SR.)</label>
                <input {...register("father_full")} style={{ padding:6, width:"100%" }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>25. MOTHER'S MAIDEN NAME (SURNAME / FIRST NAME / MIDDLE NAME)</label>
                <input {...register("mother_full")} style={{ padding:6, width:"100%" }} />
              </div>
            </div>
          </div>

          {/* ================= PAGE 2 (EDUCATIONAL, CIVIL SERVICE, WORK EXPERIENCE) ================= */}
          <div className="page" style={{
              width:"100%", minHeight:"297mm", background:"white", padding:"18px", boxSizing:"border-box", marginBottom:"20px"
            }}>
            <h4>III. EDUCATIONAL BACKGROUND</h4>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  <th style={{border:"1px solid #ccc", padding:6}}>LEVEL</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>NAME OF SCHOOL</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>BASIC EDUCATION / DEGREE / COURSE</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>PERIOD OF ATTENDANCE (From - To)</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>HIGHEST LEVEL / UNITS EARNED</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>YEAR GRADUATED</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>SCHOLARSHIP / HONORS</th>
                </tr>
              </thead>
              <tbody>
                {["ELEMENTARY","SECONDARY","VOCATIONAL","COLLEGE","GRADUATE STUDIES"].map((lvl)=>(
                  <tr key={lvl}>
                    <td style={{border:"1px solid #ccc", padding:6, width:120}}>{lvl}</td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`${lvl}_school`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`${lvl}_course`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`${lvl}_from`)} placeholder="From" style={{padding:6, width:120}}/> - <input {...register(`${lvl}_to`)} placeholder="To" style={{padding:6, width:120}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`${lvl}_highest`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`${lvl}_gradYear`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`${lvl}_honors`)} style={{width:"100%", padding:6}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginTop: 18 }}>IV. CIVIL SERVICE ELIGIBILITY</h4>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  <th style={{border:"1px solid #ccc", padding:6}}>CAREER SERVICE / RATING</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>DATE OF EXAM / CONFERMENT</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>PLACE OF EXAM</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>LICENSE (No.)</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>VALIDITY</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length:5}).map((_,i)=>(
                  <tr key={i}>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`elig_${i}_title`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`elig_${i}_date`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`elig_${i}_place`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`elig_${i}_license`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`elig_${i}_valid`)} style={{width:"100%", padding:6}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginTop: 18 }}>V. WORK EXPERIENCE (Start from recent)</h4>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  <th style={{border:"1px solid #ccc", padding:6}}>INCLUSIVE DATES (From)</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>INCLUSIVE DATES (To)</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>POSITION TITLE</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>DEPARTMENT / AGENCY / COMPANY</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>MONTHLY SALARY</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>SALARY GRADE & STEP</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>STATUS OF APPOINTMENT</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>GOV'T SERVICE?</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length:8}).map((_,i)=>(
                  <tr key={i}>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`work_${i}_from`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`work_${i}_to`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`work_${i}_title`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`work_${i}_agency`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`work_${i}_salary`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`work_${i}_grade`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`work_${i}_status`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`work_${i}_govt`)} style={{width:"100%", padding:6}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGE 3 (Voluntary Work, L&D, Other Info) ================= */}
          <div className="page" style={{
              width:"100%", minHeight:"297mm", background:"white", padding:"18px", boxSizing:"border-box", marginBottom:"20px"
            }}>
            <h4>VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOV'T ORG</h4>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  <th style={{border:"1px solid #ccc", padding:6}}>NAME & ADDRESS OF ORG</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>FROM</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>TO</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>NO. OF HOURS</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>POSITION / NATURE</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length:5}).map((_,i)=>(
                  <tr key={i}>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`vol_${i}_org`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`vol_${i}_from`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`vol_${i}_to`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`vol_${i}_hours`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`vol_${i}_pos`)} style={{width:"100%", padding:6}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginTop: 18 }}>VII. LEARNING AND DEVELOPMENT</h4>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  <th style={{border:"1px solid #ccc", padding:6}}>TITLE</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>FROM</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>TO</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>NO. HOURS</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>TYPE</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>SPONSORED BY</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length:5}).map((_,i)=>(
                  <tr key={i}>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ld_${i}_title`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`ld_${i}_from`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input type="date" {...register(`ld_${i}_to`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ld_${i}_hours`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ld_${i}_type`)} style={{padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ld_${i}_sponsor`)} style={{width:"100%", padding:6}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginTop: 18 }}>VIII. OTHER INFORMATION</h4>
            <div>
              <label style={{ display:"block", fontSize:12 }}>31. SPECIAL SKILLS and HOBBIES / 32. NON-ACADEMIC DISTINCTIONS / MEMBERSHIPS</label>
              <textarea {...register("other_info")} style={{ width:"100%", minHeight:120, padding:8 }} />
            </div>
          </div>

          {/* ================= PAGE 4 (Questions, References, Declaration) ================= */}
          <div className="page" style={{
              width:"100%", minHeight:"297mm", background:"white", padding:"18px", boxSizing:"border-box"
            }}>
            <h4>IX. QUESTIONS (34–40)</h4>
            <div style={{ fontSize:12 }}>
              {[
                { q: "34. Are you related by consanguinity or affinity to the appointing authority?", key: "q34" },
                { q: "35a. Have you ever been found guilty of any administrative offense?", key: "q35a" },
                { q: "35b. Have you been criminally charged before any court?", key: "q35b" },
                { q: "36. Have you ever been convicted of any crime?", key: "q36" },
                { q: "37. Have you ever been separated from the service?", key: "q37" },
                { q: "38a. Have you ever been a candidate in a national or local election?", key: "q38a" },
                { q: "38b. Have you resigned from government service to campaign?", key: "q38b" },
                { q: "39. Have you acquired immigrant/permanent resident status of another country?", key: "q39" },
                { q: "40a. Are you a member of any indigenous group?", key: "q40a" },
                { q: "40b. Are you a person with disability?", key: "q40b" },
                { q: "40c. Are you a solo parent?", key: "q40c" },
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <div style={{ marginBottom: 4 }}>{item.q}</div>
                  <label style={{ marginRight: 8 }}><input type="radio" {...register(`${item.key}`)} value="Yes" /> Yes</label>
                  <label style={{ marginRight: 8 }}><input type="radio" {...register(`${item.key}`)} value="No" /> No</label>
                  <div style={{ marginTop:6 }}>
                    <input {...register(`${item.key}_details`)} placeholder="If yes, give details" style={{ width: "60%", padding:6 }} />
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ marginTop: 18 }}>X. REFERENCES</h4>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  <th style={{border:"1px solid #ccc", padding:6}}>NAME</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>ADDRESS</th>
                  <th style={{border:"1px solid #ccc", padding:6}}>TEL. NO.</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length:3}).map((_,i)=>(
                  <tr key={i}>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ref_${i}_name`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ref_${i}_addr`)} style={{width:"100%", padding:6}}/></td>
                    <td style={{border:"1px solid #ccc", padding:6}}><input {...register(`ref_${i}_tel`)} style={{width:"100%", padding:6}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginTop: 18 }}>XI. DECLARATION</h4>
            <p style={{ fontSize:12 }}>
              I declare under oath that I have personally accomplished this Personal Data Sheet which is a true, correct and complete statement...
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 200px", gap:12, marginTop:12 }}>
              <div>
                <label style={{ fontSize:12 }}>Signature (Sign inside the box)</label>
                <input {...register("declaration_signature")} style={{ width:"100%", padding:6 }} />
              </div>
              <div>
                <label style={{ fontSize:12 }}>Date Accomplished</label>
                <input type="date" {...register("declaration_date")} style={{ width:"100%", padding:6 }} />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize:12 }}>Right Thumbmark (leave blank or attach an image in production implementation)</label>
              <div style={{ width: 220, height: 140, border: "1px dashed #999", marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#777" }}>
                PHOTO / THUMBMARK BOX
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: 12, display:"flex", gap:8 }}>
        <button onClick={handleSubmit(onSubmit)} style={{ padding:"8px 14px", background:"#1976d2", color:"#fff", border:"none", borderRadius:6 }}>Save</button>
        <button onClick={handleDownloadPDF} style={{ padding:"8px 14px", background:"#2e7d32", color:"#fff", border:"none", borderRadius:6 }}>Download Full PDS (PDF)</button>
      </div>
    </div>
  );
};

export default PDSForm;
