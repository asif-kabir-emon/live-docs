"use client";

import React from "react";
import {
    LiveblocksProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUsers } from "@/lib/actions/user.action";
import { getDocumentUsers } from "@/lib/actions/room.actions";
import { useUser } from "@clerk/nextjs";

const Provider = ({ children }: { children: React.ReactNode }) => {
    const { user: clerkUser } = useUser();

    return (
        <div>
            <LiveblocksProvider
                authEndpoint="/api/liveblocks-auth"
                resolveUsers={async ({ userIds }) => {
                    const users = getClerkUsers({ userIds });

                    return users;
                }}
                resolveMentionSuggestions={async ({ text, roomId }) => {
                    const roomUsers = await getDocumentUsers({
                        roomId,
                        currentUser: clerkUser?.emailAddresses[0].emailAddress!,
                        text,
                    });

                    return roomUsers;
                }}
            >
                <ClientSideSuspense fallback={<Loader />}>
                    {children}
                </ClientSideSuspense>
            </LiveblocksProvider>
        </div>
    );
};

export default Provider;
