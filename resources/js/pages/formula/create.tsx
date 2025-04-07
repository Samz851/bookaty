import FormulaEditor from "@/components/formulaBuilder/formulaEditor";
import { axiosInstance } from "@refinedev/simple-rest";

const CustomCalculation = () => {
    const handleSaveFormula = async (formula) => {
        try {
            await axiosInstance.post("/custom-calculation/save", {
                name: "Custom Formula",
                formula,
                user_id: 1,
            });
            alert("Formula saved successfully!");
        } catch (error) {
            alert("Error saving formula");
        }
    };

    return (
        <div>
            <h2>Create Custom Formula</h2>
            <FormulaEditor onSave={handleSaveFormula} />
        </div>
    );
};

export default CustomCalculation;