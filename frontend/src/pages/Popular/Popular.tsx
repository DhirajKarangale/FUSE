import React from "react";

import { useAppSelector } from "../../redux/hookStore";
import { urlPostPopular } from "../../api/APIs";

import PostSection from "../../components/PostSection";

function Popular() {
    const { isLoaded } = useAppSelector(state => state.user);
    if (!isLoaded) return null;

    return (
        <div className="pb-2 space-y-4">
            <PostSection baseUrl={urlPostPopular} isUserPost={false} />
        </div>
    );
}

export default React.memo(Popular);