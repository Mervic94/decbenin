
import { useContext } from 'react';
import RequestContext from './RequestContext';

export const useRequests = () => useContext(RequestContext);
