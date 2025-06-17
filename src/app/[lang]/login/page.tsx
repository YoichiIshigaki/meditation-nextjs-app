'use client';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller, type FieldErrors } from 'react-hook-form';
import { useLanguage, useTranslation } from "@/i18n/client";
import { AppIcon, TranslateText } from '@/components';

type FormData = {
  email: string;
  password: string;
};

const ErrorMessage = <T extends Record<string, string>,>(props: {
  errors: FieldErrors<T>
  type: string,
  formKey: keyof typeof errors
}) => {
  const { errors, type, formKey: key } = props;
  return errors[key]?.type === type ? (
      <TranslateText className='text-red-500 font-medium' translateKey={`validation:${key}.${type}`} />
  ) : null
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { data: session, status } = useSession();
  console.log({ session });

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

  const callbackUrl = searchParams.get('callbackUrl') || `/${language}`;

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);
  
  // submit時処理
  const onSubmit = async (data: FormData) => {
    console.log({ data });
    await handleLogin()
  };

  const handleLogin = async () => {
    const form = getValues();
    const res = await signIn('credentials', {
      redirect: false,
      callbackUrl,
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

  if (['loading', 'authenticated'].includes(status)) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-sm mx-auto space-y-4">
      <TranslateText element={"h1"} className="text-4xl font-bold capitalize" translateKey='login:login' />
      <AppIcon shape="square" size="lg" />
      <Controller
        control={control}
          name="email"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            type="text"
            name="email"
            placeholder={t('login:email')}
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
            name="password"
            placeholder={t('login:password')}
            className="w-full border p-2"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      />
      <ErrorMessage<FormData> errors={errors} type='required' formKey='email' />
      <ErrorMessage<FormData> errors={errors} type='required' formKey='password' />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        <TranslateText element={null} translateKey='login:login' />
      </button>
    </form>
  );
}
