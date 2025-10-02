import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/SALNForm.css";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { useRef, useState } from "react";

const SALNForm = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [lastSavedFormData, setLastSavedFormData] = useState(null);

  // 1. Save to backend (already present)
  const onSubmit = async (formData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?._id;
      if (!employeeId) {
        alert("User Employee ID missing. Please log in again.");
        return;
      }
      const response = await fetch("http://localhost:5000/api/saln/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          formData,
          status: "Pending",
        }),
      });
      if (!response.ok) throw new Error("Failed to save SALN");
      const result = await response.json();
      alert("SALN saved!");
      setLastSavedFormData(formData); // Save for popup
      setShowSubmitPopup(true);       // Show submit-to-HR popup
      console.log(result);
    } catch (err) {
      console.error("Error saving SALN:", err);
      alert("Failed to save SALN.");
    }
  };

  // 2. Generate filled SALN DOCX
  const generateDocx = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch("/saln-template.docx");
      const templateArrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(templateArrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      // Fill with form data (customize as needed)
      const filledData = {
        ...formData,
        jointBox: formData.filingType === "Joint" ? "✔" : "☐",
        separateBox: formData.filingType === "Separate" ? "✔" : "☐",
        naBox: formData.filingType === "NA" ? "✔" : "☐",
      };
      doc.render(filledData);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, "SALN_Filled.docx");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("There was an error generating the SALN DOCX. Check console.");
      console.error(error);
    }
  };

  // 3. Download empty SALN template
  const downloadEmptyTemplate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/empty_saln_template.docx");
      const blob = await response.blob();
      saveAs(blob, "SALN_Empty_Template.docx");
    } catch (error) {
      alert("Failed to download empty template.");
      console.error(error);
    }
    setLoading(false);
  };

  const uploadDocxToBackend = async (file, formData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?._id;
      if (!employeeId) {
        alert("User Employee ID missing. Please log in again.");
        return;
      }
      // Use declarant's surname for filename
      const surname = formData?.decl_surname
        ? formData.decl_surname.replace(/[^a-zA-Z0-9]/g, "")
        : "Employee";
      const fileName = `${surname}SALN.docx`;

      const fd = new FormData();
      fd.append("file", file, fileName);
      fd.append("employeeId", employeeId);
      fd.append("type", "SALN");
      fd.append("status", "Pending");

      const response = await fetch("http://localhost:5000/api/documents", {
        method: "POST",
        body: fd,
      });

      const result = await response.json();

      if (response.ok) {
        alert("SALN submitted to HR and is now pending!");
        console.log("Saved Document:", result.document);
      } else {
        alert(result.error || "Failed to submit SALN.");
      }
    } catch (error) {
      console.error("Error submitting SALN:", error);
      alert("An error occurred while submitting SALN.");
    }
  };

  return (
    <div className="saln-form-wrapper">
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/personal-documents")}
      >
        ← Back to Personal Documents
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="saln-form">
        <h2>Sworn Statement of Assets, Liabilities and Net Worth (SALN)</h2>

        {/* Filing type */}
        <div className="saln-field">
          <label>Filing Type</label>
          <div>
            <label>
              <input
                type="radio"
                value="Joint"
                {...register("filingType")}
                defaultChecked
              /> Joint Filing
            </label>
            <label>
              <input
                type="radio"
                value="Separate"
                {...register("filingType")}
              /> Separate Filing
            </label>
            <label>
              <input
                type="radio"
                value="NA"
                {...register("filingType")}
              /> Not Applicable
            </label>
          </div>
        </div>

        {/* Declarant Information */}
        <h4>I. Declarant Information</h4>
        <div className="saln-grid four-col">
          <div><label>Surname</label><input {...register("decl_surname")} /></div>
          <div><label>First Name</label><input {...register("decl_first")} /></div>
          <div><label>Middle Name</label><input {...register("decl_mi")} /></div>
          <div><label>Position</label><input {...register("decl_position")} /></div>
        </div>
        <div className="saln-grid two-col">
          <div><label>Agency/Office</label><input {...register("decl_agency")} /></div>
          <div><label>Office Address</label><input {...register("decl_officeAddress")} /></div>
        </div>
        <div className="saln-grid one-col">
          <label>Residential Address</label>
          <input {...register("decl_address")} />
        </div>

        {/* Spouse Information */}
        <h4>II. Spouse Information</h4>
        <div className="saln-grid four-col">
          <div><label>Surname</label><input {...register("spouse_surname")} /></div>
          <div><label>First Name</label><input {...register("spouse_first")} /></div>
          <div><label>Middle Name</label><input {...register("spouse_mi")} /></div>
          <div><label>Position</label><input {...register("spouse_position")} /></div>
        </div>
        <div className="saln-grid two-col">
          <div><label>Agency/Office</label><input {...register("spouse_agency")} /></div>
          <div><label>Office Address</label><input {...register("spouse_officeAddress")} /></div>
        </div>

        {/* Children */}
        <h4>III. Unmarried Children Below 18 (living at home)</h4>
        <table>
          <thead>
            <tr><th>Name</th><th>Date of Birth</th><th>Age</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`child_${i}_name`)} /></td>
                <td><input type="date" {...register(`child_${i}_dob`)} /></td>
                <td><input {...register(`child_${i}_age`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Assets */}
        <h4>IV. Assets</h4>
        <h5>Real Properties</h5>
        <div className="saln-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th><th>Kind</th><th>Location</th>
                <th>Assessed Value</th><th>Market Value</th>
                <th>Year</th><th>Mode</th><th>Acquisition Cost</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><input {...register(`real_${i}_desc`)} /></td>
                  <td><input {...register(`real_${i}_kind`)} /></td>
                  <td><input {...register(`real_${i}_loc`)} /></td>
                  <td><input {...register(`real_${i}_assessed`)} /></td>
                  <td><input {...register(`real_${i}_market`)} /></td>
                  <td><input {...register(`real_${i}_year`)} /></td>
                  <td><input {...register(`real_${i}_mode`)} /></td>
                  <td><input {...register(`real_${i}_acquisitionCost`)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5>Personal Properties</h5>
        <div className="saln-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Year Acquired</th>
                <th>Mode</th>
                <th>Acquisition Cost</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><input {...register(`pers_${i}_desc`)} /></td>
                  <td><input {...register(`pers_${i}_year`)} /></td>
                  <td><input {...register(`pers_${i}_mode`)} /></td>
                  <td><input {...register(`pers_${i}_cost`)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Liabilities */}
        <h4>V. Liabilities</h4>
        <table>
          <thead>
            <tr><th>Nature</th><th>Name of Creditor</th><th>Outstanding Balance</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`liab_${i}_nature`)} /></td>
                <td><input {...register(`liab_${i}_creditor`)} /></td>
                <td><input {...register(`liab_${i}_balance`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Business Interests */}
        <h4>VI. Business Interests / Financial Connections</h4>
        <table>
          <thead>
            <tr>
              <th>Entity</th><th>Business Address</th><th>Nature</th>
              <th>Interest/Connection</th><th>Date of Acquisition</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`biz_${i}_entity`)} /></td>
                <td><input {...register(`biz_${i}_addr`)} /></td>
                <td><input {...register(`biz_${i}_nature`)} /></td>
                <td><input {...register(`biz_${i}_connection`)} /></td>
                <td><input type="date" {...register(`biz_${i}_date`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Relatives in Government */}
        <h4>VII. Relatives in Government Service</h4>
        <table>
          <thead>
            <tr><th>Name</th><th>Relationship</th><th>Position</th><th>Agency/Office</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`rel_${i}_name`)} /></td>
                <td><input {...register(`rel_${i}_relationship`)} /></td>
                <td><input {...register(`rel_${i}_position`)} /></td>
                <td><input {...register(`rel_${i}_agency`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Government ID */}
        <h4>VIII. Government Issued ID</h4>
        <div className="saln-grid three-col">
          <div>
            <label>ID Type</label>
            <input {...register("govId")} />
          </div>
          <div>
            <label>ID No.</label>
            <input {...register("govIdNo")} />
          </div>
          <div>
            <label>Date Issued</label>
            <input type="date" {...register("govIdIssued")} />
          </div>
        </div>

        {/* Co-declarant/Spouse Government ID */}
        <h4>Co-declarant/Spouse Government Issued ID</h4>
        <div className="saln-grid three-col">
          <div>
            <label>ID Type</label>
            <input {...register("spouseGovId")} />
          </div>
          <div>
            <label>ID No.</label>
            <input {...register("spouseGovIdNo")} />
          </div>
          <div>
            <label>Date Issued</label>
            <input type="date" {...register("spouseGovIdIssued")} />
          </div>
        </div>

        {/* ================= Additional Sheet - Declarant ================= */}
        <h4>IX. Additional Sheet (Declarant)</h4>
        <h5>Real Properties</h5>
        <div className="saln-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th><th>Kind</th><th>Location</th>
                <th>Assessed Value</th><th>Market Value</th>
                <th>Year</th><th>Mode</th><th>Acquisition Cost</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><input {...register(`decl_real_${i}_desc`)} /></td>
                  <td><input {...register(`decl_real_${i}_kind`)} /></td>
                  <td><input {...register(`decl_real_${i}_loc`)} /></td>
                  <td><input {...register(`decl_real_${i}_assessed`)} /></td>
                  <td><input {...register(`decl_real_${i}_market`)} /></td>
                  <td><input {...register(`decl_real_${i}_year`)} /></td>
                  <td><input {...register(`decl_real_${i}_mode`)} /></td>
                  <td><input {...register(`decl_real_${i}_acquisitionCost`)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5>Personal Properties</h5>
        <div className="saln-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Year Acquired</th>
                <th>Acquisition Cost</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><input {...register(`decl_pers_${i}_desc`)} /></td>
                  <td><input {...register(`decl_pers_${i}_year`)} /></td>
                  <td><input {...register(`decl_pers_${i}_cost`)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5>Liabilities</h5>
        <table>
          <thead>
            <tr><th>Nature</th><th>Name of Creditor</th><th>Outstanding Balance</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`decl_liab_${i}_nature`)} /></td>
                <td><input {...register(`decl_liab_${i}_creditor`)} /></td>
                <td><input {...register(`decl_liab_${i}_balance`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5>Business Interests</h5>
        <table>
          <thead>
            <tr><th>Entity</th><th>Business Address</th><th>Nature</th><th>Interest/Connection</th><th>Date</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`decl_biz_${i}_entity`)} /></td>
                <td><input {...register(`decl_biz_${i}_addr`)} /></td>
                <td><input {...register(`decl_biz_${i}_nature`)} /></td>
                <td><input {...register(`decl_biz_${i}_connection`)} /></td>
                <td><input type="date" {...register(`decl_biz_${i}_date`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= Additional Sheet - Spouse & Children ================= */}
        <h4>X. Additional Sheet (Spouse & Children)</h4>
        <h5>Real Properties</h5>
        <div className="saln-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th><th>Kind</th><th>Location</th>
                <th>Assessed Value</th><th>Market Value</th>
                <th>Year</th><th>Mode</th><th>Acquisition Cost</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><input {...register(`spouse_real_${i}_desc`)} /></td>
                  <td><input {...register(`spouse_real_${i}_kind`)} /></td>
                  <td><input {...register(`spouse_real_${i}_loc`)} /></td>
                  <td><input {...register(`spouse_real_${i}_assessed`)} /></td>
                  <td><input {...register(`spouse_real_${i}_market`)} /></td>
                  <td><input {...register(`spouse_real_${i}_year`)} /></td>
                  <td><input {...register(`spouse_real_${i}_mode`)} /></td>
                  <td><input {...register(`spouse_real_${i}_acquisitionCost`)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5>Personal Properties</h5>
        <div className="saln-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Year Acquired</th>
                <th>Acquisition Cost</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><input {...register(`spouse_pers_${i}_desc`)} /></td>
                  <td><input {...register(`spouse_pers_${i}_year`)} /></td>
                  <td><input {...register(`spouse_pers_${i}_cost`)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5>Liabilities</h5>
        <table>
          <thead>
            <tr><th>Nature</th><th>Name of Creditor</th><th>Outstanding Balance</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`spouse_liab_${i}_nature`)} /></td>
                <td><input {...register(`spouse_liab_${i}_creditor`)} /></td>
                <td><input {...register(`spouse_liab_${i}_balance`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5>Business Interests</h5>
        <table>
          <thead>
            <tr><th>Entity</th><th>Business Address</th><th>Nature</th><th>Interest/Connection</th><th>Date</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`spouse_biz_${i}_entity`)} /></td>
                <td><input {...register(`spouse_biz_${i}_addr`)} /></td>
                <td><input {...register(`spouse_biz_${i}_nature`)} /></td>
                <td><input {...register(`spouse_biz_${i}_connection`)} /></td>
                <td><input type="date" {...register(`spouse_biz_${i}_date`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="save-btn" disabled={loading}>
          Save SALN
        </button>
        <button
          type="button"
          className="download"
          onClick={handleSubmit(generateDocx)}
          disabled={loading}
        >
          {loading ? "Generating SALN..." : "Download Filled SALN (DOCX)"}
        </button>
        <button
          type="button"
          className="download"
          onClick={downloadEmptyTemplate}
          disabled={loading}
        >
          Download Empty SALN Template (DOCX)
        </button>
      </form>

      {showSubmitPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Do you want to submit this to the HR?</h3>
            <div className="modal-actions">
              <button
                className="modal-btn"
                onClick={async () => {
                  setShowSubmitPopup(false);
                  setLoading(true);
                  try {
                    // Generate DOCX from template
                    const response = await fetch("/saln-template.docx");
                    const templateArrayBuffer = await response.arrayBuffer();
                    const zip = new PizZip(templateArrayBuffer);
                    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

                    // Fill data as in your generateDocx function
                    const filledData = {
                      ...lastSavedFormData,
                      jointBox: lastSavedFormData.filingType === "Joint" ? "✔" : "☐",
                      separateBox: lastSavedFormData.filingType === "Separate" ? "✔" : "☐",
                      naBox: lastSavedFormData.filingType === "NA" ? "✔" : "☐",
                    };
                    doc.render(filledData);
                    const out = doc.getZip().generate({
                      type: "blob",
                      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });

                    // Upload DOCX to backend (this submits to HR's pending records)
                    await uploadDocxToBackend(out, lastSavedFormData);
                    setLoading(false);
                  } catch (error) {
                    setLoading(false);
                    alert("Error submitting to HR.");
                    console.error(error);
                  }
                }}
              >
                YES
              </button>
              <button
                className="modal-btn"
                onClick={() => setShowSubmitPopup(false)}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SALNForm;
