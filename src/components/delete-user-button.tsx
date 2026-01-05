"use client"

import { deleteEntityAction } from "@/actions/delete-user.action"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteEntityButtonProps {
  Id: string | number
}

export const DeleteEntityButton = ({ Id }: DeleteEntityButtonProps) => {
  const [isPending, setIsPending] = useState(false)

  async function handleClick() {
    setIsPending(true)

    const { error } = await deleteEntityAction({ Id })

    if (error) toast.error(error)
    else toast.success('User deleted successfully')

    setIsPending(false)
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm"
      disabled={isPending}
      onClick={handleClick}
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  )
}

export const PlaceHolderDeleteEntityButton = () => {
  return (
    <Button
      size="icon"
      variant="destructive" className="size-7 rounded-sm" disabled
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  )  
}