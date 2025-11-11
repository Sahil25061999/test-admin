'use client';
import React, { useEffect, useState } from 'react'
import { CHRYSUS_API } from '../../../../config';
import { Table } from '../../../../components/Table';
import { MANDATE_TXN_INFO } from '../../../../constants/transactions.constants';
import { useAuthAxios } from '../../../../hooks/useAuthAxios';



export default function Page({params}) {
  const [data,setData] = useState([])
    const apiInstance = useAuthAxios()
  
  useEffect(()=>{
    (async()=>{
      try{
        const res = await apiInstance.get(`/admin/v1/mandate/transaction/info?notification_id=${params.slug}`)
        setData(res.data.data.transaction_data)
      }catch(e){

      }
    })()
  },[])
  return (
    <div>
      <Table data={data} columns={MANDATE_TXN_INFO}/>
    </div>
  )
}
