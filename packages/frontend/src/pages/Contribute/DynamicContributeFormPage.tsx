// // import { useParams } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import DynamicContributionForm from "../../components/DynamicContributionForm";
// // import Header from "../../components/Header";



// // const DynamicContributeFormPage = () => {
// //   const { type } = useParams<{ type: string }>();
// //   const [formDef, setFormDef] = useState<any>(null);

// //   useEffect(() => {
// //     fetch("/api/contribution-forms")
// //       .then((res) => res.json())
// //       .then((forms) => {
// //         const found = forms.find((f: any) => f.id === type);
// //         setFormDef(found);
// //       });
// //   }, [type]);

// //   if (!formDef) return <div>Loading...</div>;

// //   const handleSubmit = (data: Record<string, any>) => {
// //     alert("נשלח: " + JSON.stringify(data));
// //   };

// //   return (
// //     <div className="min-h-screen bg-background flex flex-col">
// //       <Header framed={false} />
// //       <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
// //         <div className="text-center mb-12">
// //           <h1 className="text-5xl font-bold mb-4 text-white">{formDef.title}</h1>
// //           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{formDef.description}</p>
// //         </div>
// //         <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
// //           <DynamicContributionForm fields={formDef.fields} onSubmit={handleSubmit} />
// //         </div>
// //       </main>

// //     </div>
// //   );
// // };

// // export default DynamicContributeFormPage;




import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DynamicContributionForm from "../../components/DynamicContributionForm";
import Header from "../../components/Header";

const DynamicContributeFormPage = () => {
  const { type } = useParams<{ type: string }>();
  const [formDef, setFormDef] = useState<any>(null);

  useEffect(() => {
    fetch("/api/contribution-forms")
      .then((res) => res.json())
      .then((forms) => {
        const found = forms.find((f: any) => f.id === type);
        setFormDef(found);

        // **הגלילה לראש העמוד מתבצעת כאן, לאחר שהנתונים נטענו ונקבעו בסטייט.**
        // הוספנו setTimeout קצר כדי לתת לדפדפן זמן לסיים לרנדר את התוכן
        // במיוחד בדפדפנים כמו Firefox שיכולים להתנהג מעט שונה.
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 400); // ניתן לשנות את הערך (למשל 200 או 300) אם 100 לא מספיק
      })
      .catch((error) => {
        console.error("Failed to fetch form definition:", error);
        // ייתכן שתרצה להוסיף כאן טיפול בשגיאות למשתמש, למשל להציג הודעת שגיאה
      });
  }, [type]); // ה-dependency array כולל את 'type' כדי שהאפקט ירוץ מחדש אם הפרמטר 'type' ב-URL משתנה

  // מציג "Loading..." עד שהנתונים נטענים
  if (!formDef) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (data: Record<string, any>) => {
    alert("נשלח: " + JSON.stringify(data));
    // כאן תוכל לבצע שליחה אמיתית לשרת, ניווט וכו'.
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header framed={false} />
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">{formDef.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{formDef.description}</p>
        </div>
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
          <DynamicContributionForm fields={formDef.fields} onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
};

export default DynamicContributeFormPage;