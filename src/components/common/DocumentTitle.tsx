import {useEffect} from 'react';

export default function DocumentTitle({children}:{children?:string | undefined}) {
    useEffect(() => {
        document.title = children ?? 'Direct Labor Admin';
    }, [children]);

    return null;
}
