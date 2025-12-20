import ConfirmMailContent from 'components/authentication/ConfirmMailContent';
import bgImg from 'assets/14.jpg';
import AuthSplitLayout from 'layouts/AuthSplitLayout';

const ConfirmMail = () => {
  return (
    <AuthSplitLayout bgProps={{ image: bgImg, position: '50% 30%' }}>
      <div className="text-center">
        <ConfirmMailContent email="xyz@abc.com" layout="split" titleTag="h3" />
      </div>
    </AuthSplitLayout>
  );
};

export default ConfirmMail;
