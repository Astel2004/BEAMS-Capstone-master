import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/SALNForm.css";

const SALNForm = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const employeeId = localStorage.getItem("userId"); // ✅ use Mongo _id
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
      console.log(result);
    } catch (err) {
      console.error("Error saving SALN:", err);
      alert("Failed to save SALN.");
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
          <select {...register("filingType")}>
            <option value="Joint">Joint Filing</option>
            <option value="Separate">Separate Filing</option>
            <option value="NA">Not Applicable</option>
          </select>
        </div>

        {/* Declarant Information */}
        <h4>I. Declarant Information</h4>
        <div className="saln-grid four-col">
          <div><label>Surname</label><input {...register("decl_surname")} /></div>
          <div><label>First Name</label><input {...register("decl_first")} /></div>
          <div><label>M.I.</label><input {...register("decl_middle")} /></div>
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
          <div><label>M.I.</label><input {...register("spouse_middle")} /></div>
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
            {Array.from({ length: 5 }).map((_, i) => (
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
        <table>
          <thead>
            <tr>
              <th>Description</th><th>Kind</th><th>Location</th>
              <th>Assessed Value</th><th>Market Value</th>
              <th>Year</th><th>Mode</th><th>Acquisition Cost</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
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

        <h5>Personal Properties</h5>
        <table>
          <thead>
            <tr><th>Description</th><th>Year Acquired</th><th>Acquisition Cost</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`pers_${i}_desc`)} /></td>
                <td><input {...register(`pers_${i}_year`)} /></td>
                <td><input {...register(`pers_${i}_cost`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Liabilities */}
        <h4>V. Liabilities</h4>
        <table>
          <thead>
            <tr><th>Nature</th><th>Name of Creditor</th><th>Outstanding Balance</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
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
            {Array.from({ length: 5 }).map((_, i) => (
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
            {Array.from({ length: 5 }).map((_, i) => (
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
          <div><label>ID Type</label><input {...register("govId")} /></div>
          <div><label>ID No.</label><input {...register("govIdNo")} /></div>
          <div><label>Date Issued</label><input type="date" {...register("govIdIssued")} /></div>
        </div>

        {/* ================= Additional Sheet - Declarant ================= */}
        <h4>IX. Additional Sheet (Declarant)</h4>
        <h5>Real Properties</h5>
        <table>
          <thead>
            <tr>
              <th>Description</th><th>Kind</th><th>Location</th>
              <th>Assessed Value</th><th>Market Value</th>
              <th>Year</th><th>Mode</th><th>Acquisition Cost</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
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

        <h5>Personal Properties</h5>
        <table>
          <thead>
            <tr><th>Description</th><th>Year Acquired</th><th>Acquisition Cost</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`decl_pers_${i}_desc`)} /></td>
                <td><input {...register(`decl_pers_${i}_year`)} /></td>
                <td><input {...register(`decl_pers_${i}_cost`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5>Liabilities</h5>
        <table>
          <thead>
            <tr><th>Nature</th><th>Name of Creditor</th><th>Outstanding Balance</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
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
            {Array.from({ length: 3 }).map((_, i) => (
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
        <table>
          <thead>
            <tr>
              <th>Description</th><th>Kind</th><th>Location</th>
              <th>Assessed Value</th><th>Market Value</th>
              <th>Year</th><th>Mode</th><th>Acquisition Cost</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
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

        <h5>Personal Properties</h5>
        <table>
          <thead>
            <tr><th>Description</th><th>Year Acquired</th><th>Acquisition Cost</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                <td><input {...register(`spouse_pers_${i}_desc`)} /></td>
                <td><input {...register(`spouse_pers_${i}_year`)} /></td>
                <td><input {...register(`spouse_pers_${i}_cost`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5>Liabilities</h5>
        <table>
          <thead>
            <tr><th>Nature</th><th>Name of Creditor</th><th>Outstanding Balance</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
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
            {Array.from({ length: 3 }).map((_, i) => (
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

        <button type="submit" className="save-btn">Save SALN</button>
      </form>
    </div>
  );
};

export default SALNForm;
