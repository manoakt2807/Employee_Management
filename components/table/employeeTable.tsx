"use client";

import React from "react";
import { EmployeeState } from "@/app/(root)/page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from "../ui/button";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from "react-toastify";


const EmployeeTable = () => {
    const { data, page, state, handleEdit, setActiveTabs } = EmployeeState(state => state);
    const handleUpdate = (value: string, index: number) => {
        if (value == 'edit') {
            sessionStorage.setItem('edit', JSON.stringify(data[index]))
            sessionStorage.setItem('tabs', '2')
            handleEdit(data[index])
            setActiveTabs('2')
        } else {
            confirmAlert({
                title: 'Confirm to Delete',
                message: 'Are you sure to delete this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            let updatedValue = data;
                            updatedValue.splice(index, 1);
                            state(updatedValue);
                            localStorage.setItem('employeeDetail', JSON.stringify(updatedValue));
                            toast.success('Deleted Successfully')
                        }
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        }
    }
    const recordsPerPage = 5;
    const startIndex = recordsPerPage * (page - 1);
    const endIndex = startIndex + recordsPerPage;


    return (

        <Table className="border border-gray-200 w-full">
            <TableHeader className="sticky top-0">
                <TableRow className="">
                    <TableHead className="pl-12">Id</TableHead>
                    <TableHead >Profile</TableHead>
                    <TableHead >Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead >Salary</TableHead>
                    <TableHead className="text-right pr-7">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className=" ">
                {data.slice(startIndex, endIndex).map((value, index) => (
                    <TableRow key={value.id} className="even:bg-gray-200 even:hover:bg-gray-200">
                        <TableCell className="font-medium pl-12">{index + startIndex + 1}</TableCell>
                        <TableCell>
                            <img src={value.url} alt="" className="w-12" />
                        </TableCell>
                        <TableCell>{value.name}</TableCell>
                        <TableCell>{value.age}</TableCell>
                        <TableCell>{value.salary}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end">
                                <Button variant={'ghost'} size={'icon'}>
                                    <PencilIcon className="w-5 h-5" onClick={() => handleUpdate('edit', startIndex + index)} />
                                </Button>

                                <Button variant={'ghost'} size={'icon'}>
                                    <TrashIcon className="w-5 h-5" onClick={() => handleUpdate('delete', startIndex + index)} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    );
};

export default EmployeeTable;
