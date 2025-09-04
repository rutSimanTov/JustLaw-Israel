import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import '../index.css'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/UI/Table"
    
import { Link } from "react-router-dom";
import{Button} from "../components/UI/Button/button";
import { fetchAllSignatories, type SignatoryData } from "../services/atjService";

import { useEffect } from "react";
// לא היתה לי אפשרות לבצע קריאת שרת, אז השתמשתי במערך זמני 


// const fetchSignatories = async () => {
//   const { data, error } = await supabase
//     .from("atj_treaty_signatories")
//   if (error) {
//     console.error("Error fetching signatories:", error);
//     throw new Error(error.message);
//   }
//   return data;
// };

// interface Signatory {
//     id: number;
//     name: string;
//     country: string;
//     type: string;
//     representative_name: string;
//     representative_title: string;
// }




const ATJTreaty = () => {

  const {
    data: signatories,
    isLoading,
    error,
  } = useQuery<SignatoryData[]>({
    queryKey: ["signatories"],
    queryFn: fetchAllSignatories,
  });

  console.log('🖥️ ATJTreaty Component State:', {
    isLoading,
    error: error?.message,
    signatories,
    signatoriesLength: signatories?.length
  });
        useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header framed={false} />
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">
            ATJ Treaty Signatories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            The following individuals and organizations have signed the Access
            to Justice Treaty, committing to a future where justice is
            accessible to all.
          </p>
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground">
            Loading signatories...
          </p>
        )}
        {error && (
          <div className="text-center text-destructive">
            <p>There was an error loading the signatories. Please try again later.</p>
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer">Show error details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-left">
                {error.message || JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {signatories && signatories.length >0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Representative</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signatories.map((signatory) => (
                  <TableRow key={signatory.id}>
                    <TableCell className="font-medium">
                      {signatory.name}
                    </TableCell>
                    <TableCell>{signatory.country}</TableCell>
                    <TableCell className="capitalize">
                      {signatory.type === 'individual' ? 'Individual' : 'Organization'}
                    </TableCell>
                    <TableCell>
                      {signatory.type === 'organization' && 
                       signatory.representative_name &&
                       signatory.representative_title
                        ? `${signatory.representative_name} (${signatory.representative_title})`
                        : signatory.type === 'individual' 
                        ? "Individual"
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {signatories && signatories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground mb-8">
              No one has signed the treaty yet. Be the first!
            </p>
            <div className="flex justify-center items-center gap-4">
              <Link to="/treaty_individual">
                <Button size="lg">Sign as an Individual</Button>
              </Link>
              <Link to="/treaty_organization">
                <Button size="lg">Sign as an Organization</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
     
    </div>
  );
};

export default ATJTreaty;
