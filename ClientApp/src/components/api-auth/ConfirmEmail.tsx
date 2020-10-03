import * as React from 'react';

export const ConfirmEmailSuccess: React.FC<{}> = (props) => {
    return (
        <div>
            You successfully confirmed email. Please, log in.
        </div>
    )
}

export const BadConfirmEmail: React.FC<{}> = (props) => {
    return (
        <div>
            BadConfirmEmail
        </div>
    )
}