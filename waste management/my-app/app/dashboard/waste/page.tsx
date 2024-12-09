import ManagementCollect from "@/components/ui/waste/managementCollect";
import ManagementReport from "@/components/ui/waste/managementReport";

export default function page() {

    

    return (
       <div>
            <ManagementReport></ManagementReport>
            <div>
                <ManagementCollect></ManagementCollect>
            </div>
       </div>
    );
}