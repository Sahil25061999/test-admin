"use client";

import {  Table } from "antd";

import {  useEffect, useState } from "react";
import { UpiUserSearch } from "../../../../components/index.component";
// import { apiInstance } from "../../../../config";
import { useToast } from "../../../../context/toast.context";
import { Modal } from "../../../../components/Modal/Modal";
import { useAuthAxios } from "../../../../hooks/useAuthAxios";

const columns = [
  {
    title: "Sr.No.",
    dataIndex: "id",
    key: "Sr.No.",
  },
  {
    title: "Phone",
    dataIndex: "phone_number",
    key: "Phone",
  },
  // {
  //   title: "Name",
  //   dataIndex: "name",
  //   key: "name",
  // },
  {
    title: "Unblock",
    dataIndex: "unblock",
    key: "Unblock",
    // render: item=>{
    //   return <Link href={`/users/${item.phone_number}`}><EyeIcon className="h-6 aspect-square"/></Link>
    // }
  },
];

export default function Page() {
  const [phone, setPhone] = useState("");
  const [isOpenBlockModal, setIsOpenBlockModal] = useState(false);
  const [isOpenUnblockModal, setIsOpenUnblockModal] = useState(false);

  const [unblockPhone, setUnblockPhone] = useState<string>("");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const apiInstance = useAuthAxios()

  const unblockUser = async () => {
    setIsOpenUnblockModal(() => false);
    try {
      const res = await apiInstance.delete(
        `admin/v1/user/block?phone=${unblockPhone}`
      );
      if (res.data.success) {
        fetchBlockedUsersList();
      }
    } catch (e) {
      if (e?.response?.message) {
        toast({
          title: "Error",
          description: e.reponse.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    } finally {
      setUnblockPhone("");
    }
  };

  const blockUser = async () => {
    setIsOpenBlockModal(() => false);
    try {
      const res = await apiInstance.post("admin/v1/user/block", {
        phone: phone,
      });
      if (res.data.success) {
        fetchBlockedUsersList();
      }
      // console.log(res);
    } catch (e) {
      // console.error(e.response);
      if (e?.response?.data.error) {
        toast({
          title: "Error",
          description: e.response.data.error,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    } finally {
      setPhone("");
    }
  };

  const openConfirmationModal = async (e, cb) => {
    e?.preventDefault();
    // setUserDetails(phone);
    cb(() => true);
  };
  const handleSelect = (phone) => {
    setUnblockPhone(() => phone);
    openConfirmationModal(null, setIsOpenUnblockModal);
  };

  const closeModal = (cb) => {
    cb(() => false);
    setPhone("");
    setUnblockPhone("");
  };

  const fetchBlockedUsersList = async () => {
    try {
      const res = await apiInstance.get("admin/v1/user/block");
      if (res.data.success) {
        setData(() => {
          return res?.data?.data.blocked_users.map(
            (item: { phone_number: string }, index) => {
              return {
                key: index,
                ...item,
                unblock: (
                  <button
                    className=" border"
                    onClick={() => handleSelect(item.phone_number)}
                  >
                    Unblock
                  </button>
                ),
                // account_status: (
                //   <select
                //     value={item.account_status}
                //     style={{ background: "transparent" }}
                //     onChange={(e) => {
                //       handleSelect(e.target.value, item);
                //     }}
                //   >
                //     <option
                //       value={item.account_status}
                //       selected
                //       disabled
                //       hidden
                //     >
                //       {item.account_status}
                //     </option>
                //     {/* {item.status === "blocked" && ( */}
                //     <option className=" bg-black" value="active">Unblock</option>
                //     {/* )} */}
                //   </select>
                // ),
              };
            }
          );
        });
      }
    } catch (e) {
      if (e?.response?.message) {
        toast({
          title: "Error",
          description: e.reponse.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  };

  useEffect(() => {
    fetchBlockedUsersList();
  }, []);

  return (
    <div>
      <UpiUserSearch
        placeholder={"Enter phone number"}
        input={phone}
        setInput={setPhone}
        handleSubmit={(e) => openConfirmationModal(e, setIsOpenBlockModal)}
      />
      <h1>Blocked Users</h1>
      <section className="mt-4">
        <Table
          // className=""
          rootClassName={"table_paginator"}
          columns={columns}
          dataSource={data}
          // onChange={(pagination, filters) => {
          //   if (status.length == 0 && !filters?.Status) return;
          //   let existingStatus = status.sort();
          //   let newFilteredStatus = filters.Status?.sort();
          //   if (
          //     JSON.stringify(existingStatus) ===
          //     JSON.stringify(newFilteredStatus)
          //   )
          //     return;
          //   setStatus(() => (filters.Status ? filters.Status : []));
          //   console.log("page set");
          //   setCurrentPage(() => 1);
          //   setLimit(() => 10);
          // }}
          // pagination={{
          //   total: totalPages * limit,
          //   onChange(page, pageSize) {
          //     console.log("page set2");
          //     setCurrentPage(() => page);
          //     setLimit(() => pageSize);
          //   },
          // }}
        />
      </section>
      <Modal
        action={() => blockUser()}
        question="Are you sure you want to block the user?"
        isOpen={isOpenBlockModal}
        closeModal={() => closeModal(setIsOpenBlockModal)}
      />
      <Modal
        action={() => unblockUser()}
        question="Are you sure you want to unblock the user?"
        isOpen={isOpenUnblockModal}
        closeModal={() => closeModal(setIsOpenUnblockModal)}
      />
    </div>
  );
}
