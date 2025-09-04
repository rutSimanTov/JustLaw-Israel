// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import DynamicForm from "../components/DynamicForm";
// import Header from "../components/Header";
// import Footer from "../components/Footer";


// const DynamicFormPage = () => {
//   const params = useParams<{ type?: string }>();
//   const { type } = useParams<{ type: string }>();
//   const [formDef, setFormDef] = useState<any>(null);

//   useEffect(() => {
//     fetch("/api/forms")
//       .then((res) => res.json())
//       .then((forms) => {
//         const found = forms.find((f: any) => f.id === type);
//         setFormDef(found);
//       });
//   }, [type]);

//   if (!formDef) return <div>Loading...</div>;



//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Header framed={false} />
//       <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold mb-4 text-white">{formDef.title}</h1>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{formDef.description}</p>
//         </div>
//         <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
//           {/* <DynamicForm fields={formDef.fields} onSubmit={formHandlers[formDef.id]} /> */}
//           <DynamicForm fields={formDef.fields} formType={formDef.id} />

//           {/* <DynamicForm fields={formDef.fields} onSubmit={formHandlers[formDef.id]} /> */}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default DynamicFormPage;



import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DynamicForm from "../components/DynamicForm";
import Header from "../components/Header";

type DynamicFormPageProps = {
  type?: string;
};
const DynamicFormPage: React.FC<DynamicFormPageProps> = (props) => {
  const params = useParams<{ type?: string }>();
  // קודם מה-URL, אם אין אז מה-props, ואם אין גם אז ברירת מחדל
  const type = params.type || props.type || "contact";
  // const params = useParams<{ type?: string }>();
  // const { type } = useParams<{ type: string }>();
  const [formDef, setFormDef] = useState<any>(null);
  useEffect(() => {
    fetch("http://localhost:3001/api/forms")
      .then((res) => res.json())
      .then((forms) => {
        const found = forms.find((f: any) => f.id === type);
        setFormDef(found);
      });
  }, [type]);
  console.log(type,formDef);
  if (!formDef) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header framed={false} />
      <main className="flex-1  pb-20 px-6 container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">{formDef.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{formDef.description}</p>
        </div>
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
          {/* <DynamicForm fields={formDef.fields} onSubmit={formHandlers[formDef.id]} /> */}
          <DynamicForm fields={formDef.fields} formType={formDef.id} />
          {/* <DynamicForm fields={formDef.fields} onSubmit={formHandlers[formDef.id]} /> */}
        </div>
      </main>
     
    </div>
  );
};
export default DynamicFormPage;