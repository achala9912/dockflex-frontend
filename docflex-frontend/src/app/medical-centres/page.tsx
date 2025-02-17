"use client";
import RoundButton from '@/components/Buttons/RoundButton'
import CentreCard from '@/components/Cards/CentreCard'
import InputField from '@/components/InputField/InputField'
import { Tooltip } from '@/components/ui/tooltip';
import React from 'react'
import { FiSearch } from 'react-icons/fi'

import { IoMdAdd } from 'react-icons/io';



function page() {
    const newCentre = () => {
        console.log('New Centre')
    }
    return (
        <>
            <div className="flex justify-between mb-3">
                <h3 className="flex items-center font-semibold font-inter">Registered Medical Centres</h3>

            </div>

            <div className="flex flex-col ">
                <div className="flex justify-between mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex gap-4">
                        <InputField
                            id="searchNameOrId"
                            width="w-400"
                            icon={<FiSearch />}
                            type="text"
                            value={''}
                            placeholder="Search Category ID / Name"
                            // onChange={onSearch}
                            label={true}
                            labelName='Category ID / Name'
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


            <CentreCard />
        </>
    )
}

export default page