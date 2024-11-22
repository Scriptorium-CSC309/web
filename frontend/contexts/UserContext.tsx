/* Reducers and contexts for managing a global user state for the frontend. */

import { createContext, ReactNode, useReducer } from "react";

/* Information about an authenticated user.*/
export interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    avatarId: number;
    phoneNumber: string;
}

/*
 * The state of the user in the current context.
 * Contains information about the user if unathenticated, or null otherwise.
 */
export type UserState = User | null;

/* Allowed actions on the user state */
export type UserAction =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" }
    | { type: "UPDATE_PROFILE"; payload: Partial<User> };

/* Given a user state and an action, returns a new user state after applying the action to the old state.*/
const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            return null;
        case "UPDATE_PROFILE":
            if (state === null) {
                throw new Error("Cannot update null user");
            }
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const StateContext = createContext<UserState>(null);
export const DispatchContext = createContext<React.Dispatch<UserAction>>((_) => null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(userReducer, null);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};
