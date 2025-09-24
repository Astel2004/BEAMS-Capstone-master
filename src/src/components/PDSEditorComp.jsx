import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import "../styles/PDSForm.css";

// Helper function for citizenship placeholders
function getCitizenshipPlaceholders(citizenship, dualType, country) {
  return {
    filipinoBox: citizenship === "Filipino" ? "✔" : "☐",
    dualBox: citizenship === "Dual" ? "✔" : "☐",
    byBirthBox: citizenship === "Dual" && dualType === "Birth" ? "✔" : "☐",
    byNaturalBox: citizenship === "Dual" && dualType === "Naturalization" ? "✔" : "☐",
    citizenshipCountry: citizenship === "Dual" ? country : ""
  };
}

const PDSForm = () => {
  const { register, handleSubmit, watch } = useForm();
  const wrapperRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ---- Save data in console (debug) ----
  const onSubmit = (data) => {
    const citizenshipPlaceholders = {
      filipinoBox: data.citizenship === "Filipino" ? "✔" : "☐",
      dualBox: data.citizenship === "Dual" ? "✔" : "☐",
      byBirthBox: data.citizenship === "Dual" && data.dualType === "Birth" ? "✔" : "☐",
      byNaturalBox: data.citizenship === "Dual" && data.dualType === "Naturalization" ? "✔" : "☐",
      citizenshipCountry:
        data.citizenship === "Dual" ? (data.citizenshipCountry || "") : ""
    };

    const placeholders = { ...data, ...citizenshipPlaceholders };

    console.log("Final placeholders:", placeholders);

    generateDocx(placeholders); // your existing docxtemplater call
  };

  // ---- Generate DOCX from template ----
  const generateDocx = async (formData) => {
    try {
      setLoading(true);

      // Always reload the template
      const response = await fetch("/pds-template.docx");
      const templateArrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(templateArrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      // Citizenship placeholders
      const citizenshipPlaceholders = getCitizenshipPlaceholders(
        formData.citizenship,
        formData.dualType,
        formData.citizenshipCountry
      );

      // Checkbox logic
      const filledData = {
        ...formData,
        maleBox: formData.sex === "Male" ? "✔" : "☐",
        femaleBox: formData.sex === "Female" ? "✔" : "☐",

        singleBox: formData.civilStatus === "Single" ? "✔" : "☐",
        marriedBox: formData.civilStatus === "Married" ? "✔" : "☐",
        widowedBox: formData.civilStatus === "Widowed" ? "✔" : "☐",
        separatedBox: formData.civilStatus === "Separated" ? "✔" : "☐",
        otherBox: formData.civilStatus === "Other" ? "✔" : "☐",

        ...citizenshipPlaceholders
      };

      // Inject form data into template
      doc.render(filledData);

      // Export the filled DOCX
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Simulate processing delay (10 seconds)
      setTimeout(() => {
        saveAs(out, "PDS_Filled.docx");
        setLoading(false);
      }, 10000);
    } catch (error) {
      console.error("Error generating DOCX:", error);
      setLoading(false);
      alert("There was an error generating the PDS DOCX. Check console.");
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/personal-documents")}
      >
        ← Back to Personal Documents
      </button>

      {/* Scrollable form wrapper */}
      <div ref={wrapperRef} className="pds-form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="pds-form">
          {/* ================= PAGE 1 ================= */}
          <div className="page">
            <div className="header-text">
              <div className="header-bold">CS FORM No. 212 (Revised 2017)</div>
              <div className="header-bold">PERSONAL DATA SHEET</div>
            </div>

            <div className="warning">
              <strong>WARNING:</strong> Any misrepresentation made in the Personal Data Sheet...
            </div>

            {/* 1. CS ID No */}
            <div className="cs-id-no">
              <label>1. CS ID No. <small>(Do not fill up. For CSC use only)</small></label>
              <input {...register("csIdNo")} />
            </div>

            {/* I. PERSONAL INFORMATION */}
            <h4>I. PERSONAL INFORMATION</h4>

            {/* 2. Name row */}
            <div className="pds-grid four-col">
              <div className="pds-field">
                <label>2. SURNAME</label>
                <input {...register("surname")} />
              </div>
              <div className="pds-field">
                <label>FIRST NAME</label>
                <input {...register("firstName")} />
              </div>
              <div className="pds-field">
                <label>MIDDLE NAME</label>
                <input {...register("middleName")} />
              </div>
              <div className="pds-field">
                <label>NAME EXTENSION (JR., SR.)</label>
                <input {...register("nameExt")} />
              </div>
            </div>

            {/* 3 & 4: DOB & Place of birth */}
            <div className="pds-grid two-col">
              <div className="pds-field">
                <label>3. DATE OF BIRTH (mm/dd/yyyy)</label>
                <input type="date" {...register("dateOfBirth")} />
              </div>
              <div className="pds-field">
                <label>4. PLACE OF BIRTH</label>
                <input {...register("placeOfBirth")} />
              </div>
            </div>

            {/* Citizenship, Sex, Civil status */}
            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>5. SEX</label>
                <div className="radio-group">
                  <label><input type="radio" value="Male" {...register("sex")} /> Male</label>
                  <label><input type="radio" value="Female" {...register("sex")} /> Female</label>
                </div>
              </div>
              <div className="pds-field">
                <label>6. CIVIL STATUS</label>
                <div className="radio-group">
                  <label><input type="radio" value="Single" {...register("civilStatus")} /> Single</label>
                  <label><input type="radio" value="Married" {...register("civilStatus")} /> Married</label>
                  <label><input type="radio" value="Widowed" {...register("civilStatus")} /> Widowed</label>
                  <label><input type="radio" value="Separated" {...register("civilStatus")} /> Separated</label>
                  <label>Other: <input {...register("civilStatusOther")} /></label>
                </div>
              </div>
            </div>

            {/* Height / Weight / Blood Type */}
            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>7. HEIGHT (m)</label>
                <input {...register("height")} placeholder="e.g., 1.65" />
              </div>
              <div className="pds-field">
                <label>8. WEIGHT (kg)</label>
                <input {...register("weight")} placeholder="e.g., 60" />
              </div>
              <div className="pds-field">
                <label>9. BLOOD TYPE</label>
                <input {...register("bloodType")} />
              </div>
            </div>

            {/* IDs (10-15), Contacts (19-21) */}
            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>10. GSIS ID NO.</label>
                <input {...register("gsis")} />
              </div>
              <div className="pds-field">
                <label>11. PAG-IBIG ID NO.</label>
                <input {...register("pagibig")} />
              </div>
              <div className="pds-field">
                <label>12. PHILHEALTH NO.</label>
                <input {...register("philhealth")} />
              </div>
            </div>

            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>13. SSS NO.</label>
                <input {...register("sss")} />
              </div>
              <div className="pds-field">
                <label>14. TIN NO.</label>
                <input {...register("tin")} />
              </div>
              <div className="pds-field">
                <label>15. AGENCY EMPLOYEE NO.</label>
                <input {...register("agencyEmployeeNo")} />
              </div>
              <div className="pds-field citizenship-field">
                <label>16. CITIZENSHIP</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" value="Filipino" {...register("citizenship")} /> Filipino
                  </label>
                  <label>
                    <input type="radio" value="Dual" {...register("citizenship")} /> Dual Citizenship
                  </label>
                  {/* Only show these if Dual is selected */}
                  {watch("citizenship") === "Dual" && (
                    <div className="dual-options">
                      <label>
                        <input type="radio" value="Birth" {...register("dualType")} /> by birth
                      </label>
                      <label>
                        <input type="radio" value="Naturalization" {...register("dualType")} /> by naturalization
                      </label>
                      <div className="dual-country">
                        <label>
                          Pls. indicate country:
                          <input type="text" {...register("citizenshipCountry")} placeholder="Country" />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address blocks: Residential (17) and Permanent (18) */}
            <div className="pds-grid two-col">
              <div className="address-box">
                <div className="address-title">17. RESIDENTIAL ADDRESS</div>
                <input {...register("res_houseNo")} placeholder="House/Block/Lot No." />
                <input {...register("res_street")} placeholder="Street" />
                <input {...register("res_subdivision")} placeholder="Subdivision/Village" />
                <input {...register("res_barangay")} placeholder="Barangay" />
                <div className="address-row">
                  <input {...register("res_city")} placeholder="City/Municipality" />
                  <input {...register("res_province")} placeholder="Province" />
                  <input {...register("res_zip")} placeholder="ZIP CODE" />
                </div>
              </div>
              <div className="address-box">
                <div className="address-title">18. PERMANENT ADDRESS</div>
                <input {...register("perm_houseNo")} placeholder="House/Block/Lot No." />
                <input {...register("perm_street")} placeholder="Street" />
                <input {...register("perm_subdivision")} placeholder="Subdivision/Village" />
                <input {...register("perm_barangay")} placeholder="Barangay" />
                <div className="address-row">
                  <input {...register("perm_city")} placeholder="City/Municipality" />
                  <input {...register("perm_province")} placeholder="Province" />
                  <input {...register("perm_zip")} placeholder="ZIP CODE" />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>19. TELEPHONE NO.</label>
                <input {...register("telephone")} />
              </div>
              <div className="pds-field">
                <label>20. MOBILE NO.</label>
                <input {...register("mobile")} />
              </div>
              <div className="pds-field">
                <label>21. E-MAIL ADDRESS (if any)</label>
                <input {...register("email")} />
              </div>
            </div>

            {/* II. FAMILY BACKGROUND */}
            <h4>II. FAMILY BACKGROUND</h4>

            {/* Spouse */}
            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>22. SPOUSE'S SURNAME</label>
                <input {...register("spouse_surname")} />
              </div>
              <div className="pds-field">
                <label>FIRST NAME</label>
                <input {...register("spouse_first")} />
              </div>
              <div className="pds-field">
                <label>MIDDLE NAME</label>
                <input {...register("spouse_middle")} />
              </div>
            </div>

            {/* Children (multiple rows) */}
            <div className="pds-field">
              <label>23. NAME OF CHILDREN (Write full name and list all) — DATE OF BIRTH (mm/dd/yyyy)</label>
              <div className="children-list">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="children-row">
                    <input {...register(`child_${i}_name`)} placeholder={`Child ${i + 1} full name`} />
                    <input type="date" {...register(`child_${i}_dob`)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Father & Mother */}
            <div className="pds-grid two-col">
              <div className="pds-field">
                <label>24. FATHER'S SURNAME / FIRST NAME / MIDDLE NAME / NAME EXTENSION (JR., SR.)</label>
                <input {...register("father_full")} />
              </div>
              <div className="pds-field">
                <label>25. MOTHER'S MAIDEN NAME (SURNAME / FIRST NAME / MIDDLE NAME)</label>
                <input {...register("mother_full")} />
              </div>
            </div>
          </div>

          {/* ================= PAGE 2 (EDUCATIONAL, CIVIL SERVICE, WORK EXPERIENCE) ================= */}
          <div className="page">
            <h4>III. EDUCATIONAL BACKGROUND</h4>
            <table>
              <thead>
                <tr>
                  <th>26. LEVEL</th>
                  <th>NAME OF SCHOOL</th>
                  <th>BASIC EDUCATION / DEGREE / COURSE</th>
                  <th>PERIOD OF ATTENDANCE (From - To)</th>
                  <th>HIGHEST LEVEL / UNITS EARNED</th>
                  <th>YEAR GRADUATED</th>
                  <th>SCHOLARSHIP / HONORS</th>
                </tr>
              </thead>
              <tbody>
                {["ELEMENTARY", "SECONDARY", "VOCATIONAL", "COLLEGE", "GRADUATE STUDIES"].map((lvl) => (
                  <tr key={lvl}>
                    <td>{lvl}</td>
                    <td><input {...register(`${lvl}_school`)} /></td>
                    <td><input {...register(`${lvl}_course`)} /></td>
                    <td>
                      <input {...register(`${lvl}_from`)} placeholder="From" /> - <input {...register(`${lvl}_to`)} placeholder="To" />
                    </td>
                    <td><input {...register(`${lvl}_highest`)} /></td>
                    <td><input {...register(`${lvl}_gradYear`)} /></td>
                    <td><input {...register(`${lvl}_honors`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>IV. CIVIL SERVICE ELIGIBILITY</h4>
            <table>
              <thead>
                <tr>
                  <th>27. CAREER SERVICE / RATING</th>
                  <th>DATE OF EXAM / CONFERMENT</th>
                  <th>PLACE OF EXAM</th>
                  <th>LICENSE (No.)</th>
                  <th>VALIDITY</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><input {...register(`elig_${i}_title`)} /></td>
                    <td><input type="date" {...register(`elig_${i}_date`)} /></td>
                    <td><input {...register(`elig_${i}_place`)} /></td>
                    <td><input {...register(`elig_${i}_license`)} /></td>
                    <td><input type="date" {...register(`elig_${i}_valid`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>V. WORK EXPERIENCE (Start from recent)</h4>
            <table>
              <thead>
                <tr>
                  <th>28. INCLUSIVE DATES (From)</th>
                  <th>INCLUSIVE DATES (To)</th>
                  <th>POSITION TITLE</th>
                  <th>DEPARTMENT / AGENCY / COMPANY</th>
                  <th>MONTHLY SALARY</th>
                  <th>SALARY GRADE & STEP</th>
                  <th>STATUS OF APPOINTMENT</th>
                  <th>GOV'T SERVICE?</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td><input type="date" {...register(`work_${i}_from`)} /></td>
                    <td><input type="date" {...register(`work_${i}_to`)} /></td>
                    <td><input {...register(`work_${i}_title`)} /></td>
                    <td><input {...register(`work_${i}_agency`)} /></td>
                    <td><input {...register(`work_${i}_salary`)} /></td>
                    <td><input {...register(`work_${i}_grade`)} /></td>
                    <td><input {...register(`work_${i}_status`)} /></td>
                    <td><input {...register(`work_${i}_govt`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGE 3 (Voluntary Work, L&D, Other Info) ================= */}
          <div className="page">
            <h4>VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOV'T ORG</h4>
            <table>
              <thead>
                <tr>
                  <th>29. NAME & ADDRESS OF ORG</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>NO. OF HOURS</th>
                  <th>POSITION / NATURE</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><input {...register(`vol_${i}_org`)} /></td>
                    <td><input type="date" {...register(`vol_${i}_from`)} /></td>
                    <td><input type="date" {...register(`vol_${i}_to`)} /></td>
                    <td><input {...register(`vol_${i}_hours`)} /></td>
                    <td><input {...register(`vol_${i}_pos`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>VII. LEARNING AND DEVELOPMENT</h4>
            <table>
              <thead>
                <tr>
                  <th>30. TITLE</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>NO. HOURS</th>
                  <th>TYPE</th>
                  <th>SPONSORED BY</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><input {...register(`ld_${i}_title`)} /></td>
                    <td><input type="date" {...register(`ld_${i}_from`)} /></td>
                    <td><input type="date" {...register(`ld_${i}_to`)} /></td>
                    <td><input {...register(`ld_${i}_hours`)} /></td>
                    <td><input {...register(`ld_${i}_type`)} /></td>
                    <td><input {...register(`ld_${i}_sponsor`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>VIII. OTHER INFORMATION</h4>
            <table>
              <thead>
                <tr>
                  <th>31. SPECIAL SKILLS and HOBBIES</th>
                  <th>32. NON-ACADEMIC DISTINCTIONS / RECOGNITION<br /><span>(Write in full)</span></th>
                  <th>33. MEMBERSHIP IN ASSOCIATION/ORGANIZATION<br /><span>(Write in full)</span></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <input type="text" {...register(`skills_hobbies_${i}`)} />
                    </td>
                    <td>
                      <input type="text" {...register(`distinctions_${i}`)} />
                    </td>
                    <td>
                      <input type="text" {...register(`memberships_${i}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* ================= PAGE 4 (Questions, References, Declaration) ================= */}
            <div className="page">
            <h4>IX. QUESTIONS (34–40)</h4>
<table className="questions-table">
  <thead>
    <tr>
      <th>Questions</th>
      <th>Yes</th>
      <th>No</th>
      <th>If YES, give details</th>
    </tr>
  </thead>
  <tbody>
    {/* Q34a */}
    <tr>
      <td>
        34a. Are you related by consanguinity or affinity within the third degree to the appointing/recommending authority, 
        or to the chief of bureau/office, or the person who has immediate supervision over you in the office, bureau or department where you will be appointed?
      </td>
      <td><input type="radio" {...register("q34a")} value="Yes" /></td>
      <td><input type="radio" {...register("q34a")} value="No" /></td>
      <td><input {...register("q34a_details")} /></td>
    </tr>

    {/* Q34b */}
    <tr>
      <td>34b. Within the fourth degree (for Local Government Unit - Career Employees)?</td>
      <td><input type="radio" {...register("q34b")} value="Yes" /></td>
      <td><input type="radio" {...register("q34b")} value="No" /></td>
      <td><input {...register("q34b_details")} /></td>
    </tr>

    {/* Q35a */}
    <tr>
      <td>35a. Have you ever been found guilty of any administrative offense?</td>
      <td><input type="radio" {...register("q35a")} value="Yes" /></td>
      <td><input type="radio" {...register("q35a")} value="No" /></td>
      <td><input {...register("q35a_details")} /></td>
    </tr>

    {/* Q35b */}
    <tr>
      <td>35b. Have you been criminally charged before any court?</td>
      <td><input type="radio" {...register("q35b")} value="Yes" /></td>
      <td><input type="radio" {...register("q35b")} value="No" /></td>
      <td>
        <input {...register("q35b_details")} placeholder="Details" />
        <input {...register("q35b_dateFiled")} placeholder="Date Filed" />
        <input {...register("q35b_status")} placeholder="Status of Case/s" />
      </td>
    </tr>

    {/* Q36 */}
    <tr>
      <td>36. Have you ever been convicted of any crime or violation of any law, decree, ordinance, or regulation by any court or tribunal?</td>
      <td><input type="radio" {...register("q36")} value="Yes" /></td>
      <td><input type="radio" {...register("q36")} value="No" /></td>
      <td><input {...register("q36_details")} /></td>
    </tr>

    {/* Q37 */}
    <tr>
      <td>
        37. Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, 
        dismissal, termination, end of term, finished contract, or phased out (abolition) in the public or private sector?
      </td>
      <td><input type="radio" {...register("q37")} value="Yes" /></td>
      <td><input type="radio" {...register("q37")} value="No" /></td>
      <td><input {...register("q37_details")} /></td>
    </tr>

    {/* Q38a */}
    <tr>
      <td>38a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?</td>
      <td><input type="radio" {...register("q38a")} value="Yes" /></td>
      <td><input type="radio" {...register("q38a")} value="No" /></td>
      <td><input {...register("q38a_details")} /></td>
    </tr>

    {/* Q38b */}
    <tr>
      <td>38b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?</td>
      <td><input type="radio" {...register("q38b")} value="Yes" /></td>
      <td><input type="radio" {...register("q38b")} value="No" /></td>
      <td><input {...register("q38b_details")} /></td>
    </tr>

    {/* Q39 */}
    <tr>
      <td>39. Have you acquired the status of an immigrant or permanent resident of another country?</td>
      <td><input type="radio" {...register("q39")} value="Yes" /></td>
      <td><input type="radio" {...register("q39")} value="No" /></td>
      <td><input {...register("q39_details")} placeholder="If YES, give country" /></td>
    </tr>

    {/* Q40 main header */}
<tr>
  <td colSpan="4" style={{ fontWeight: "bold" }}>
    40. Pursuant to RA 8371 (Indigenous Peoples’ Act), RA 7277 (Magna Carta for Disabled Persons), 
    and RA 8972 (Solo Parents Welfare Act), please answer the following items:
  </td>
</tr>

{/* Q40a */}
<tr>
  <td>a. Are you a member of any indigenous group?</td>
  <td><input type="radio" {...register("q40a")} value="Yes" /></td>
  <td><input type="radio" {...register("q40a")} value="No" /></td>
  <td><input {...register("q40a_details")} placeholder="If YES, please specify" /></td>
</tr>

{/* Q40b */}
<tr>
  <td>b. Are you a person with disability?</td>
  <td><input type="radio" {...register("q40b")} value="Yes" /></td>
  <td><input type="radio" {...register("q40b")} value="No" /></td>
  <td><input {...register("q40b_details")} placeholder="If YES, specify ID No." /></td>
</tr>

{/* Q40c */}
<tr>
  <td>c. Are you a solo parent?</td>
  <td><input type="radio" {...register("q40c")} value="Yes" /></td>
  <td><input type="radio" {...register("q40c")} value="No" /></td>
  <td><input {...register("q40c_details")} placeholder="If YES, specify ID No." /></td>
</tr>
  </tbody>
</table>


            <h4>X. REFERENCES</h4>
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ADDRESS</th>
                  <th>TEL. NO.</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td><input {...register(`ref_${i}_name`)} /></td>
                    <td><input {...register(`ref_${i}_addr`)} /></td>
                    <td><input {...register(`ref_${i}_tel`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>XI. GOVERNMENT ISSUED ID (i.e., Passport, Driver’s License, etc.)</h4>
            <div className="pds-grid two-col">
              <div className="pds-field">
                <label>Government Issued ID:</label>
                <input {...register("govId")} />
              </div>
              <div className="pds-field">
                <label>ID/License/Passport No.:</label>
                <input {...register("govIdNo")} />
              </div>
            </div>
            <div className="pds-field">
              <label>Date/Place of Issuance:</label>
              <input {...register("govIdIssuedAt")} />
            </div>

            <div className="pds-grid three-col">
              <div className="pds-field">
                <label>Signature (Sign inside the box)</label>
                <input {...register("signatureBox")} />
              </div>
              <div className="pds-field">
                <label>Date Accomplished</label>
                <input type="date" {...register("dateAccomplished")} />
              </div>
              <div className="pds-field">
                <label>Right Thumbmark</label>
                <input {...register("thumbmark")} />
              </div>
            </div>

            <h4>XII. DECLARATION</h4>
            <p className="declaration-text">
              I declare under oath that I have personally accomplished this Personal Data Sheet which is a true, correct and complete statement...
            </p>
            <div className="pds-grid declaration-grid">
              <div className="pds-field">
                <label>Signature (Sign inside the box)</label>
                <input {...register("declaration_signature")} />
              </div>
              <div className="pds-field">
                <label>Date Accomplished</label>
                <input type="date" {...register("declaration_date")} />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ACTION BUTTONS */}
      <div className="button-container">
        <button className="save" onClick={handleSubmit(onSubmit)} disabled={loading}>
          Save
        </button>
        <button
          className="download"
          onClick={handleSubmit(generateDocx)}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Generating PDS...
            </>
          ) : (
            "Download Filled PDS (DOCX)"
          )}
        </button>
      </div>
    </div>
  );
};

export default PDSForm;
