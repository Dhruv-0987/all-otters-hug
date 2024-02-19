import { UPDATE_USER_MUTATION } from '@/graphql/mutations';
import { UpdateUserMutation, UpdateUserMutationVariables } from '@/graphql/types';
import { HttpError, useForm } from '@refinedev/core';
import { GetFields, GetVariables } from '@refinedev/nestjs-query';
import { Drawer, Spin } from 'antd';
import React from 'react'

type props = {
    opened: boolean,
    setOpen: (open: boolean) => void;
    userId: string;
}

const AccoutnSettingsModal = ({opened, setOpen, userId}: props) => {
    const { formLoading, onFinish, queryResult } = useForm<
    GetFields<UpdateUserMutation>, 
    HttpError, 
    GetVariables<UpdateUserMutationVariables>>({
        mutationMode: "optimistic",
        resource: 'users',
        action: 'edit',
        id: userId,
        meta:{
            gqlMutation: UPDATE_USER_MUTATION
        }
    });
    console.log(queryResult?.data?.data, opened);
    const {avatarUrl, name} = queryResult?.data?.data || {};

    const closeModal = () => {
        setOpen(false);
    }

    if (queryResult?.isLoading) {
        return (
            <Drawer
                open={opened}
                onClose={closeModal}
                width={756}
                styles={{body:{
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}}
            >
                <Spin />
            </Drawer>
        )
    }

  return (
    <div>
      Hello drwaer
    </div>
  )
}

export default AccoutnSettingsModal
