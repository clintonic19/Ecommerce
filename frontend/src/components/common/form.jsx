import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const Form = ({ formControls, FormData, setFormData, onSubmit, buttonText }) => {
   
    function inputByComponentType (getControlItem){

        let inputElement = null;
        const value = FormData[getControlItem.name] || ''; 

        switch (getControlItem.componentType){
            case 'input':
                inputElement = (<Input 
                name={getControlItem.name} 
                type={getControlItem.type} 
                placeholder={getControlItem.placeholder} 
                id = {getControlItem.name}
                value = {value}
                onChange = {(e) => setFormData({
                    ...FormData, [getControlItem.name]: e.target.value})}
                />)
                break;

                case 'select':
                inputElement = (
                    <Select value = {value} onValueChange = {(val) => setFormData({
                        ...FormData, [getControlItem.name]: val})} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getControlItem.label} />                        
                        </SelectTrigger>
                        <SelectContent>
                            {
                                getControlItem.options && getControlItem.options.length > 0 ? 
                                getControlItem.options.map(option => 
                                <SelectItem 
                                    key={option.id} 
                                    value={option.id}>
                                        {option.label}
                                </SelectItem>) : null
                            }
                        </SelectContent>                       
                    </Select>
                )
                break;

                case 'textarea':
                inputElement = (<Textarea 
                name={getControlItem.name} 
                placeholder={getControlItem.placeholder} 
                id = {getControlItem.name}
                value = {value}
                onChange = {(e) => setFormData({
                    ...FormData, [getControlItem.name]: e.target.value})}
                />)
                break;

                default:
                    inputElement = (<Input 
                    name={getControlItem.name} 
                    type={getControlItem.type} 
                    placeholder={getControlItem.placeholder} 
                    id = {getControlItem.name}
                    value = {value}
                    onChange = {(e) => setFormData({...FormData, [getControlItem.name]: e.target.value})}
                    />)
                }              
                return inputElement;
        }

  return (
    <form onSubmit={onSubmit}  >
        <div className="flex flex-col gap-4">
            {/* Render form controls dynamically */}

            {
                formControls.map(control => 
                    <div key={control?.name} className=" grid w-full gap-1.5">
                        <Label htmlFor={control?.name} className="mb-2 text-base font-medium">{control?.label}</Label>

                        {inputByComponentType(control) }
                        
                    </div>
                )}
        </div>

        <Button className="mt-8 w-full " type="submit">{buttonText || 'Submit'}</Button>

        {/* <Button
          type='submit'
          className='mt-4 w-full rounded-lg h-10 bg-gray-700 text-white'
          label='Sign Up'
           buttonText={buttonText || "Submit"}
        /> */}
    </form>
  );
};

export default Form

