"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
    userId,
    email,
}: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled",
        };

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],
        };

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: [],
        });

        revalidatePath("/");

        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while creating room: ${error}`);
    }
};

export const getDocument = async ({
    roomId,
    userId,
}: {
    roomId: string;
    userId: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if (!hasAccess) {
            throw new Error("You don't have access to this room.");
        }

        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while getting room: ${error}`);
    }
};

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updateRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title,
            },
        });

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updateRoom);
    } catch (error) {
        console.log(`Error happened while updating a room: ${error}`);
    }
};

export const getDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email });

        return parseStringify(rooms);
    } catch (error) {
        console.log(`Error happened while getting rooms: ${error}`);
    }
};

export const getDocumentUsers = async ({
    roomId,
    currentUser,
    text,
}: {
    roomId: string;
    currentUser: string;
    text: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter(
            (email) => email !== currentUser,
        );

        if (text.length) {
            const lowerCaseText = text.toLowerCase();

            const filterUsers = users.filter((email: string) =>
                email.toLowerCase().includes(lowerCaseText),
            );

            return parseStringify(filterUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.log(`Error fetching document users: ${error}`);
    }
};

export const updateDocumentAccess = async ({
    roomId,
    email,
    userType,
    updatedBy,
}: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        };

        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses,
        });

        if (room) {
            //TODO: Send to notification to the user
        }

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while updating room access: ${error}`);
    }
};

export const removeCollaborator = async ({
    roomId,
    email,
}: {
    roomId: string;
    email: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        if (room.metadata.email === email) {
            throw new Error("You can't remove the creator.");
        }
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null,
            },
        });

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (error) {
        console.log(`Error happened while removing a collaborator: ${error}`);
    }
};

export const deleteDocument = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);

        revalidatePath("/");
        redirect("/");
    } catch (error) {
        console.log(`Error happened while deleting a collaborator: ${error}`);
    }
};
