import { getUserClassrooms } from '@/app/actions/classroom';
import { ClassroomsClient } from './ClassroomsClient';

export default async function ClassroomsPage() {
  const classrooms = await getUserClassrooms();
  return <ClassroomsClient classrooms={classrooms} />;
}
