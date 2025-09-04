import React, { useState, useEffect } from 'react';
import { AddParticipantsForm } from '../features/accelerator/AddParticipantsForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus  } from '@fortawesome/free-solid-svg-icons';
import {Button} from '../components/UI/Button/button'
import GroupIcon from '@mui/icons-material/Group';
import {PencilLine} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/UI/tooltip";
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Cohort } from '@base-project/shared';
import { CreateCohortForm } from '../features/accelerator/CreateCohortForm';
import '../features/event/EventModal.css'
import {useUserRoleByEmail} from '../hooks/useUsers'
import CohortList from '../components/CohortList';



const AcceleratorOptions = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isCohortFormOpen, setIsCohortFormOpen] = useState(false);
    const [isParticipantsFormOpen, setIsParticipantsFormOpen] = useState(false);
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [cohortsLoading, setCohortsLoading] = useState(true);
    const [cohortsError, setCohortsError] = useState<string | null>(null);
    const userEmail=localStorage.getItem("userEmail");
    const {role, loading,error}=useUserRoleByEmail(userEmail!);

    // Fetch cohorts ONCE on page load
    useEffect(() => {
        let mounted = true;
        const loadCohorts = async () => {
            setCohortsLoading(true);
            setCohortsError(null);
            try {
                const res = await require('../services/api').apiService.getCohorts();
                if (mounted) setCohorts(res.data.items || []);
            } catch (err) {
                if (mounted) setCohortsError('Failed to load cohorts');
            } finally {
                if (mounted) setCohortsLoading(false);
            }
        };
        loadCohorts();
        return () => { mounted = false; };
    }, []);

        useEffect(() => {
            
        }, [userEmail]);

    //open or close add cohort form
    const toggleCohortForm = () => {
        setIsCohortFormOpen(!isCohortFormOpen);
    };

    //open or close add participants form
    const toggleAddParticipantsForm=()=>{
        setIsParticipantsFormOpen(!isParticipantsFormOpen)
    }
    return (
        <>
        <main className="flex-1 pb-1 px-6 container mx-auto">
        {(!loading&&!error&&(role==='admin'))&&
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            {/* create cohort button */}
            <TooltipProvider>
                <div  style={{alignSelf: 'flex-end'}} >
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button onClick={toggleCohortForm}>
                            <FontAwesomeIcon icon={faPlus} /> 
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            sideOffset={6}
                            className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                        >
                           create cohort
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

        {/* add participants to cohort button */}
            <TooltipProvider>
                <div  style={{alignSelf: 'flex-end'}} >
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button onClick={toggleAddParticipantsForm}>
                            <GroupIcon /> 
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            sideOffset={6}
                            className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                        >
                           add participants to cohort
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            {/* edit cohorts button */}
            <TooltipProvider>
                <div  style={{alignSelf: 'flex-end'}} >
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button onClick={() => setShowUpdateModal(true)}>
                            <PencilLine /> 
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            sideOffset={6}
                            className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                        >
                           edit cohorts
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            {/* add event button */}
            <TooltipProvider>
                <div  style={{alignSelf: 'flex-end'}} >
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Link to="/add-event">
                        <Button>
                            <FontAwesomeIcon icon={faCalendarPlus} /> 
                        </Button>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            sideOffset={6}
                            className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                        >
                           add event
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
                
            

            {isCohortFormOpen && <CreateCohortForm  onClose={toggleCohortForm}  />} {/* show the form if isCohortFormOpen*/}

            {isParticipantsFormOpen && <AddParticipantsForm onClose={toggleAddParticipantsForm} />} {/* show the form if isParticipantFormOpen*/}

       {/* Cohort Modal */}
        
            {showUpdateModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    {cohortsLoading?(<p>loading...</p>):(
                    <CohortList
                        cohorts={cohorts}
                        loading={false}
                        error={cohortsError}
                        onClose={() => setShowUpdateModal(false)}
                        onRefresh={async (updatedCohort) => {
                            // Update cached state instantly
                            if (updatedCohort) {
                                setCohorts(prev => prev.map(c => c.id === updatedCohort.id ? updatedCohort : c));
                    }

                     // Refetch in background for consistency
                     try {
                         const res = await require('../services/api').apiService.getCohorts();
                         setCohorts(res.data.items || []);
                     } catch (err) {
                         setCohortsError('Failed to load cohorts');
                     }
                 }}
             />
             )}
         </div>
     )}
     </div>}
       </main>
        </>
    );
};

export default AcceleratorOptions;
