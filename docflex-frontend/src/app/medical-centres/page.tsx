"use client";

import RoundButton from '@/components/Buttons/RoundButton';
import CentreCard from '@/components/Cards/CentreCard';
import InputField from '@/components/InputField/InputField';
import { Tooltip } from '@/components/ui/tooltip';
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import jsonData from '@/data/data.json';
import { useRouter } from 'next/navigation';

function Page() {

    const router = useRouter();
    const newCentre = () => {
        console.log('New Centre');
    };

    const handleView = (centre: { id: string }): void => {
        router.push(`/medical-centres/view/${centre.id}`);
    }

    return (
        <>
            <div className="flex justify-between mb-3">
                <h3 className="flex items-center font-semibold font-inter text-lg">Registered Medical Centres</h3>
            </div>

            <div className="flex flex-col ">
                <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex gap-4 w-full sm:w-auto">
                        <InputField
                            id="centre-search"
                            width="w-full sm:w-96"
                            icon={<FiSearch />}
                            type="text"
                            value={''}
                            placeholder="Search Centre ID / Name"
                            onChange={() => { }}
                            label={true}
                            labelName="Centre ID / Name"
                        />
                    </div>
                    <Tooltip content="Add New Centre" side="top">
                        <RoundButton
                            icon={IoMdAdd}
                            className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
                            onClick={newCentre}
                        />
                    </Tooltip>
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                {jsonData.centreData.map(centre => (
                    <CentreCard
                        key={centre.id}
                        topName={centre.id}
                        middleName={centre.name}
                        bottomName={centre.address}
                        handleEdit={() => console.log('Edit Centre', centre.id)}
                        handleDelete={() => console.log('Delete Centre', centre.id)}
                        handleView={() => handleView(centre)}
                    />
                ))}
            </div>
        </>
    );
}

export default Page;
