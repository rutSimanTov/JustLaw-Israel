import React from 'react';
import { useUpdateGoogleEvent } from '../hooks/useUpdateGoogleEvent';
import {Tooltip,TooltipContent, TooltipProvider, TooltipTrigger,} from "../components/UI/tooltip";
import { Button } from "../components/UI/Button/button";
import {X } from "lucide-react"; 
interface UpdateEventFormProps {
  eventId: string;
  onClose:()=>void;
  onUpdate: (updatedEvent: any) => void
}
const UpdateEventForm: React.FC<UpdateEventFormProps> = ({ eventId,onClose,onUpdate }) => {
  const {
    form,
    loading,
    message,
    error,
    handleChange,
    handleSubmit,
    isFormValid
  } = useUpdateGoogleEvent(eventId);

  const handleFormSubmit = async (e: React.FormEvent) => {
    const updatedEvent = await handleSubmit(e); // קבל את האירוע המעודכן
    if (updatedEvent) {
      onUpdate(updatedEvent); // העבר את האירוע המעודכן לפונקציה onUpdate
    }
  }
  return (
    <>
    <TooltipProvider>
                        <div className='close-button' >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="bottom"
                                    sideOffset={6}
                                    className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                                >
                                    close
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Update Meeting</h2>
          <p className="mt-2 text-muted-foreground">Edit your existing Google Calendar meeting</p>
        </div>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <input
            id="summary"
            name="summary"
            type="text"
            value={form.summary}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
            placeholder="Work meeting"
          />
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none"
            placeholder="Meeting description"
          />
          <input
            id="start"
            name="start"
            type="datetime-local"
            value={form.start}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
          />
          <input
            id="end"
            name="end"
            type="datetime-local"
            value={form.end}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
          />
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full h-10 px-4 py-3 rounded-md font-medium text-white transition-colors duration-200
              ${!isFormValid ? 'bg-gray-300 cursor-not-allowed' : loading ? 'bg-gray-400 cursor-wait' : 'bg-primary hover:bg-primary/90'}`}
          >
            {loading ? 'Saving...' : 'Update Event'}
          </button>
        </form>
        {message && <div className="text-center text-green-600 font-bold">:white_check_mark: {message}</div>}
        {error && <div className="text-center text-red-600 font-bold">:x: {error}</div>}
      </div>
    </div>
    </>
  );
};
export default UpdateEventForm;