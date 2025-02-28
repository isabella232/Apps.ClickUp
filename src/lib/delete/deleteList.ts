import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {  UIKitBlockInteractionContext} from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitBaseIncomingInteraction } from "@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getAccessTokenForUser } from "../../storage/users";

import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';

export async function deleteList({
    context,
    data,
    room,
    read,
    persistence,
    modify,
    http,
}: {
    context: UIKitBlockInteractionContext,
    data: IUIKitBaseIncomingInteraction,
    room: IRoom;
    read: IRead;
    persistence: IPersistence;
    modify: IModify;
    http: IHttp;
}) {
    const user: IUser = context.getInteractionData().user;
    const token = await getAccessTokenForUser(read, user);
    const list_id = context.getInteractionData().value;
    const headers = {
        Authorization: `${token?.token}`,
    };

    const response = await http.del(`https://api.clickup.com/api/v2/list/${list_id}/`,{ headers });
    if(response.statusCode==HttpStatusCode.OK) {
        const textSender = await modify
        .getCreator()
        .startMessage()
        .setText(`✅️ List deleted successfully!`);
        if (room) {
            textSender.setRoom(room);
        }
    await modify.getCreator().finish(textSender);
    }
    else {
        const textSender = await modify
        .getCreator()
        .startMessage()
        .setText(`❗️ Unable to delete list! \n Error ${response.data.err}`);
        if (room) {
            textSender.setRoom(room);
        }
    await modify.getCreator().finish(textSender);
    }
}