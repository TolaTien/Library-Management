import { useContext } from 'react';
import Context from '../store/Context';

export const useStore = () => {
    const {dataUser, setDataUser} = useContext(Context);
    return {dataUser, setDataUser};
};
