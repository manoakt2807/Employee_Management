"use client";
import React, { ChangeEvent, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { isNumber } from "@mui/x-data-grid/internals";
import { Employee, EmployeeState } from "@/app/(root)/page";
import { UserIcon } from "lucide-react";
import { toast } from "react-toastify";

type Props = {};

const required_error = "This field required";

const formSchema = z.object({
    name: z
        .string({
            required_error,
        })
        .min(2)
        .max(50),
    salary: z
        .number({
            required_error,
        }).positive().max(1000000),

    age: z
        .number({
            required_error,
        }).positive().max(200),

    url: z.string().optional(),
});

const EmployeeForm = (props: Props) => {
    const { state, edit, handleEdit, setActiveTabs } = EmployeeState((state) => state);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...edit,
        },
    });
    const {
        formState: { errors },
        setValue,
        watch,
        reset,
    } = form;
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const localValue = localStorage.getItem("employeeDetail");
            let newArray: Employee[] = [];

            if (localValue) {
                const localArray = JSON.parse(localValue) as Employee[];
                newArray.push(...localArray, {
                    id: generateUniqueId(),
                    ...values,
                } as Employee);
            } else {
                newArray.push({ id: generateUniqueId(), ...values } as Employee);
            }

            localStorage.setItem("employeeDetail", JSON.stringify(newArray));
            state(newArray);
            toast.success('Employee Creadted Successfully')
        } catch (error) {
            console.log(error);
            toast.error('Some Error Occured')
        } finally {
            handleEdit(undefined)
            setActiveTabs('1')
            reset();
        }
    }

    const handleSubmitEdit = (value: z.infer<typeof formSchema>) => {
        try {
            const localValue = localStorage.getItem("employeeDetail");
            let newArray: Employee[];
            if (localValue) {
                const localArray = JSON.parse(localValue) as Employee[];
                newArray = localArray.map(dt => dt.id === edit?.id ? { id: generateUniqueId(), ...value } as Employee : dt)
                localStorage.setItem("employeeDetail", JSON.stringify(newArray));
                state(newArray)
                toast.success('Employee Updated Successfully')
                sessionStorage.clear();
            }
        } catch (error) {
            console.log(error)
            toast.error('Some Error Occured')
        } finally {
            handleEdit(undefined)
            setActiveTabs('1')
            reset();
        }
    }

    function generateUniqueId(): number {
        return Date.now();
    }


    const handleFileOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const maxAllowedSize = 1 * 1024 * 1024;
        if (fileInput.files && fileInput.files.length > 0) {
            if (fileInput.files[0].size > maxAllowedSize) {
                toast.error('Max 1mb file accepted')
                return
            }
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const fileContent = reader.result as string;
                setValue("url", fileContent);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(!edit ? onSubmit : handleSubmitEdit)}
                    className="space-y-4  text-slate-800">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <div className="w-full">
                                    <Label htmlFor="profile" className="flex flex-col w-24 h-28 gap-3 mx-auto">
                                        <div
                                            className={` flex items-center overflow-hidden justify-center w-full h-full border-dashed border-4  rounded-full`}>
                                            {watch("url") ? (
                                                <Image
                                                    src={watch("url")}
                                                    alt="Selected Image"
                                                    width={100}
                                                    height={100}
                                                    className="object-contain "
                                                />
                                            ) : (
                                                <UserIcon className="w-10 h-10" />
                                            )}
                                        </div>
                                        Profile Image
                                    </Label>
                                </div>
                                <FormControl onChange={handleFileOnChange}>
                                    <Input
                                        type="file"
                                        id="profile"
                                        className="font-normal text-base hidden"
                                        placeholder="Profile Image"
                                        accept="image/*"
                                    // {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="font-normal text-base"
                                        placeholder="Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input
                                        className="font-normal text-base"
                                        placeholder="Age"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value) ? Number(e.target.value) : '')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salary</FormLabel>
                                <FormControl>
                                    <Input
                                        className="font-normal text-base"
                                        placeholder="Salary"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value) ? Number(e.target.value) : '')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <>
                        <Button type="submit">Submit</Button>
                    </>
                </form>
            </Form>            
        </>
    );
};

export default EmployeeForm;
