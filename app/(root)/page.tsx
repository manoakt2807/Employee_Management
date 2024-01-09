'use client'
import EmployeeTable from "@/components/table/employeeTable";
import EmployeeForm from "../../components/modalPop/employeeForm";
import { create } from 'zustand';
import HeaderNav from "@/components/headerNav/header";
import PaginationTable from "@/components/table/paginationTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

export interface Employee {
  id: number;
  name: string;
  age: number;
  salary: number;
  url: string;
  profileImage: string;
}

interface EmployeeDetail {
  data: Employee[];
  page: number;
  edit?: Employee;
  state: (st: Employee[]) => void;
  setPage: (val: number) => void;
  handleEdit: (val: Employee | undefined) => void;
  activeTabs: string,
  setActiveTabs: (val: string) => void;
}

export const EmployeeState = create<EmployeeDetail>((set) => {
  const storedData = typeof window !== 'undefined' ? localStorage.getItem('employeeDetail') : null;
  return {
    data: storedData ? JSON.parse(storedData) : [],
    page: 1,
    state: (st) => set({ data: st }),
    setPage: (val) => set({ page: val }),
    handleEdit: (val) => set({ edit: val }),
    activeTabs: '1',
    setActiveTabs: (val) => set({ activeTabs: val })
  }
});

export default function Home() {
  const { edit, activeTabs, setActiveTabs, handleEdit } = EmployeeState(state => state)

  useEffect(() => {
    let getTabs = sessionStorage.getItem('tabs');
    let editValues = sessionStorage.getItem('edit')
    editValues && handleEdit(JSON.parse(editValues))
    getTabs && setActiveTabs(getTabs)
  }, [])

  const handleTabSwitch = (val: string) => {
    sessionStorage.setItem('tabs', val);
    setActiveTabs(val)
  }

  return (
    <>
      <header>
        <HeaderNav />
      </header>
      <main className='min-h-screen'>
        <div className="flex flex-col mt-4 gap-3 container">
          <Tabs defaultValue="1" value={activeTabs}
            onValueChange={(e) => handleTabSwitch(e)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={"1"}>View</TabsTrigger>
              <TabsTrigger value={"2"}  >{edit?.id ? 'Edit' : 'Create'}</TabsTrigger>
            </TabsList>
            <TabsContent value="1" className="mt-5">
              <section className="mb-5">
                <EmployeeTable />
              </section>
              <PaginationTable />
            </TabsContent>
            <TabsContent value="2" className="mt-5">
              <section className="self-end">
                <EmployeeForm />
              </section>
            </TabsContent>
          </Tabs>
        </div>

      </main>

    </>

  )
}
