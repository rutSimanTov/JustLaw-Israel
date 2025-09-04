import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/UI/Forms/forms";
import { Input } from "../components/UI/Input/input";
import { Textarea } from "../components/UI/textarea";
import { Button } from "../components/UI/Button/button";
import { useForm } from "react-hook-form";

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
};

type Props = {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
};

const DynamicContributionForm: React.FC<Props> = ({ fields, onSubmit }) => {
  const form = useForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === "textarea" ? (
                    <Textarea placeholder={field.placeholder} {...rhfField} rows={6} />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...rhfField}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="w-full">
          submit
        </Button>
      </form>
    </Form>
  );
};

export default DynamicContributionForm;