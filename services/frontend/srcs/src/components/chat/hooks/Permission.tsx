import { Player } from "../../../types/api/Player";
import { ChatRoomType } from "../type/ChatType";

/*
    Owner   block, change pass, set admin, ban, mute, kick
    Admin   block,              set admin, ban, mute, kick
    Member  
*/
export function CheckPermission(
        room: ChatRoomType | undefined,
        user: Player | null,
        targetName: string,
        order: 'changePassword' | 'addAdmin' | 'deleteAdmin' | 'ban' | 'mute' | 'unmute' | 'kick',
    ): boolean {


    if (!room || !user)
        return (false);

    const AmIOwner = (user.name === room.owner);
    const AmIAdmin = (room.admin_list.includes(user.name));
    const IsOwner = (targetName === room.owner);
    const IsAdmin = (room.admin_list.includes(targetName));

    if (order === 'changePassword')
    {
        if (AmIOwner)
            return (true);
        return (false);
    }
    if (order === 'addAdmin')
    {
        if (AmIAdmin && !IsAdmin)
            return (true);
        return false;
    }
    if (order === 'deleteAdmin')
    {
        if (AmIAdmin && IsAdmin && !IsOwner)
            return (true);
        return false;
    }
    if (order === 'ban')
    {
        if (AmIAdmin && !IsOwner)
            return true;
        return false;
    }
    if (order === 'mute')
    {
        if (AmIAdmin && !IsOwner && !room.mute_list.includes(targetName))
            return true;
        return false;
    }
    if (order === 'unmute')
    {
        if (AmIAdmin && !IsOwner && room.mute_list.includes(targetName))
            return true;
        return false;
    }
    if (order === 'kick')
    {
        if (AmIAdmin && !IsOwner)
            return true;
        return false;
    }
    return (false);
}