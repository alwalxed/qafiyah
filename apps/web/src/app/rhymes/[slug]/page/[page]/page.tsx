import { NOT_FOUND_TITLE } from '@/lib/constants';
import type { Metadata } from 'next';
import RhymePoemsSlugClientPage from './client';
export const runtime = 'edge';

export const RHYMES = new Map([
  ['3316b009-7212-4d5f-831f-f5f2d6febaa6', 'القاف'],
  ['464b68f4-d67b-40b2-9d85-21452b121b9a', 'الميم'],
  ['024d7ef1-98bd-4350-ba7f-fb1a7a4b0a65', 'الهاء'],
  ['2b7042b0-a6ee-4df1-8dd7-b30ca0b3ca58', 'الظاء'],
  ['6192f93c-afea-4fd4-92de-9e50ddb97e8b', 'الواو'],
  ['51de9b19-0ec2-4034-a7c5-cb427b910f6d', 'الشين'],
  ['cfdfe216-9f4f-4a75-9121-2b6eeaccbbbb', 'الزاى'],
  ['25dba92c-32d7-4c4e-a9e7-3596c7ce5f32', 'النون'],
  ['5fff927c-eeed-49d6-9c2e-a77cca97bd36', '(النون)'],
  ['61510471-e878-4ab2-b082-1106481a523c', 'واو'],
  ['9ff5037c-697b-433c-964b-14736364f7ce', '(الحاء)'],
  ['99fc2dba-571b-4e45-92bf-8e0d76d8625b', 'الدال'],
  ['2548e39d-da6e-40c7-a7f4-7b7335a6a966', 'الفاء'],
  ['84d21bf4-8081-4211-a207-7f4465daa488', 'الباء'],
  ['1e2bb77a-ee77-4602-989a-5b62f0ef1db5', 'الخاء'],
  ['e8c4a542-081b-433a-b3a8-1c35577ea9bb', 'الياء'],
  ['01f7dd8e-14ae-4597-bfdc-f9641671c2a4', 'الضاد'],
  ['365f00a9-4059-481e-851e-35e3177d4cc4', 'التاء'],
  ['ea67bb5c-5cbc-4376-8654-ddc219514adf', 'اللام'],
  ['cfa88411-e0d3-48d5-9efd-9ac8c510883c', '(الياء)'],
  ['b7241a08-64be-45ae-ae44-484f211980b3', 'ألف'],
  ['324a68d5-ef2d-4b67-aff7-5782d625c7bd', 'ياء'],
  ['b8090a6a-3993-45aa-b6d0-04ae3cc1e729', 'الحاء'],
  ['0af7f89b-9af0-4017-ab78-736655b841a8', '(اللام)'],
  ['645a7df9-50aa-42a1-9711-d135a287d2dc', 'السين'],
  ['cf676112-1f36-4be4-93b1-75305c44b05d', '(الفاء)'],
  ['de41d38a-3c5f-4d87-9140-2abd0c4ca1c4', '(الميم)'],
  ['8d2effc9-4f1d-4378-ac8d-2802dab5c03e', '(العين)'],
  ['f0d92875-271e-494f-95f5-5982af3fc91c', 'الطاء'],
  ['ed67656e-3d61-44b3-9f57-2e32a2ae05ff', 'الكاف'],
  ['26ddb1f5-3ccf-46fb-bcc2-1aad85e39d27', '(ال)'],
  ['b0c9d8f1-ba54-4a61-b84a-28a59d18921b', '(الالف)'],
  ['03a125fd-4343-4e18-ae18-0f543b849b8b', 'الثاء'],
  ['c963daa2-e902-406e-8e4b-2143e2c47a35', 'الراء'],
  ['27984863-a225-4c3c-97f0-5f28cce3a29b', 'الألف'],
  ['f027f95c-7be6-4c8e-bb8f-54f5fe94d23f', '(لا)'],
  ['c68a6782-e374-473f-b258-c23c21183ad2', 'الغين'],
  ['07b1c47c-d399-4bc6-a850-06d05a430a30', 'الذال'],
  ['cc8d3ed5-2304-464b-9f13-d5868b741b00', '(القاف)'],
  ['b59e03e6-b7fa-4a3a-a627-dc54d9240a96', 'الهمزة'],
  ['48510608-1db1-4d56-a42a-23ccadd7701a', 'الجيم'],
  ['a565c1f2-f388-4a2b-841b-59b3e7b79100', 'الصاد'],
  ['b3a938b1-303f-4a5b-868e-3ae706502b9d', 'العين'],
  ['1c5a3775-a4eb-40b0-8c94-8a8ea212de29', '(الدال)'],
  ['a528e485-ebbb-4790-a547-692f8f757a3d', '(الراء)'],
  ['031ac372-d6ca-4f57-bd35-bda176c3519c', '(لام)'],
  ['a2a0447a-8cf9-423a-b5a3-42d4a3539c7c', 'غير مصنف'],
]);

type Props = {
  params: { slug: string; page?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  if (RHYMES.has(slug)) {
    const rhymePattern = RHYMES.get(slug);
    return {
      title: `قافية | قصائد على قافية ${rhymePattern}`,
    };
  }
  return {
    title: NOT_FOUND_TITLE,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Page() {
  return <RhymePoemsSlugClientPage />;
}
