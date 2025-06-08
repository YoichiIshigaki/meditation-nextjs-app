'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useLanguage, useTranslation } from "@/i18n/client";
import { TranslateText } from '@/components';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  console.log({ language });

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    reValidateMode: 'onBlur',
    defaultValues: {
        password: '',
        email: ''
      }
    });
  
  // submit時処理
  const onSubmit = async (data: FormData) => {
    console.log({ data });
    await handleLogin()
  };

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = async () => {
    const form = getValues();
    const res = await signIn('credentials', {
      redirect: false,
      // callbackUrl,
      ...form
    });
    console.dir(res, { depth: null, maxArrayLength: null })

    if (res?.ok) {
      alert('ログイン成功');
      // router.push(callbackUrl);
    } else {
      alert('ログイン失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-sm mx-auto space-y-4">
      <TranslateText className="text-xl font-bold capitalize" translateKey='login:login' />
      <Controller
        control={control}
          name="email"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            type="text"
            // name="email"
            placeholder={t('login:email')} // 翻訳されない
            className="w-full border p-2"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        )} 
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            type="password"
            // name="password"
            placeholder={t('login:password')}
            className="w-full border p-2"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      />
      {errors.email?.type === 'required' && (
        <TranslateText className='text-red-500 font-medium' translateKey='validation:email.required' />
      )}
      {errors.password?.type === 'required' && (
        <TranslateText className='text-red-500 font-medium' translateKey='validation:password.required' />
      )}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        <TranslateText element={null} translateKey='login:login' />
      </button>
    </form>
  );
}
