import Customer from "@/components/customer/customer";
import Product from "@/components/product/product";

const QuestionTwo = async () => {
  return (
    <div className='flex items-center gap-10'>
      <div className='basis-1/2 flex-shrink-0'>
        <Customer />
      </div>
      <div className='flex-grow'>
        <Product />
      </div>
    </div>
  );
};

export default QuestionTwo;
