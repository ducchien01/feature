import React from "react";
import { Control, Controller, FieldErrors, FieldValues, UseFormGetValues, UseFormRegister } from "react-hook-form";
import { CalendarType, Checkbox, ComponentStatus, DatePicker, ImportFile, OptionsItem, RadioButton, Rating, Select1, SelectMultiple, Switch, Text, TextArea, TextField, Winicon } from 'wini-web-components';
import { Ultis } from "../common/Utils";
import { differenceInCalendarDays, differenceInMinutes } from "date-fns";
import { CSSProperties, ReactNode } from "react";

export function TextFieldForm(params: { label?: string, register: UseFormRegister<any>, required?: boolean, name: string, type?: React.HTMLInputTypeAttribute | "money", placeholder?: string, errors: FieldErrors<FieldValues>, maxLength?: number, readOnly?: boolean, disabled?: boolean, suffix?: ReactNode, prefix?: ReactNode, onChange?: React.ChangeEventHandler<HTMLInputElement>, onBlur?: React.FocusEventHandler<HTMLInputElement>, onFocus?: React.FocusEventHandler<HTMLInputElement>, style?: CSSProperties, labelStyle?: CSSProperties, className?: string, textFieldStyle?: CSSProperties, autoFocus?: boolean }) {
    return <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(params.style ?? {}) }}>
        {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
            <Text className="label-3">{params.label}</Text>
            {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
        </div> : null}
        <TextField
            className="body-3"
            autoFocus={params.autoFocus}
            style={{ width: '100%', flex: params.className?.includes('row') ? 1 : undefined, ...(params.type === 'money' ? { ...(params.textFieldStyle ?? {}), height: '4rem', padding: '0 0 0 1.6rem' } : (params.textFieldStyle ?? {})) }}
            placeholder={params.placeholder ? params.placeholder : params.label ? `Nhập ${params.label.toLowerCase()}` : ''}
            suffix={!params.suffix && params.type === 'money' ?
                <div className="row" style={{ padding: '0 1.6rem', height: '100%', background: 'var(--neutral-main-background-color)', borderLeft: 'var(--neutral-main-border-color)', borderRadius: '0 0.8rem 0.8rem 0' }} >
                    <Text className="button-text-3" style={{ color: 'var(--neutral-text-subtitle-color)' }}>VND</Text>
                </div> : params.suffix}
            prefix={params.prefix}
            disabled={params.disabled}
            readOnly={params.readOnly}
            type={params.type === 'money' ? 'text' : params.type}
            name={params.name}
            register={params.register(params.name, {
                required: params.required,
                onBlur: params.type === 'money' ? (ev) => {
                    let newPrice = ev.target.value.trim().replaceAll(',', '')
                    ev.target.type = "text"
                    if (!isNaN(parseFloat(newPrice))) {
                        ev.target.value = Ultis.money(parseFloat(newPrice))
                    } else {
                        ev.target.value = ''
                    }
                } : params.onBlur,
                onChange: params.onChange,
            }) as any}
            onFocus={params.type === 'money' ? (ev) => {
                ev.target.value = ev.target.value.replaceAll(',', '')
                ev.target.type = "number"
            } : params.onFocus}
            maxLength={params.maxLength}
            onComplete={(ev: any) => { ev.target.blur() }}
            helperText={convertErrors(params.errors, params.name) && (convertErrors(params.errors, params.name)?.message?.length ? convertErrors(params.errors, params.name)?.message : `Vui lòng nhập ${(params.placeholder ? params.placeholder : params.label ? `${params.label}` : 'gía trị').toLowerCase()}`)}
        />
    </div>
}

export function TextAreaForm(params: { label?: string, register: UseFormRegister<any>, required?: boolean, name: string, placeholder?: string, errors: FieldErrors<FieldValues>, maxLength?: number, readOnly?: boolean, disabled?: boolean, onChange?: React.ChangeEventHandler<HTMLTextAreaElement>, onBlur?: React.FocusEventHandler<HTMLTextAreaElement>, onFocus?: React.FocusEventHandler<HTMLTextAreaElement>, style?: CSSProperties, labelStyle?: CSSProperties, className?: string, textFieldStyle?: CSSProperties }) {
    return <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', height: '10rem', ...(params.style ?? {}) }}>
        {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
            <Text className="label-3">{params.label}</Text>
            {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
        </div> : null}
        <TextArea
            className="body-3"
            register={params.register(params.name, {
                required: params.required,
                onBlur: params.onBlur,
            }) as any}
            onFocus={params.onFocus}
            style={{ width: '100%', height: '100%', flex: 1, ...(params.textFieldStyle ?? {}) }}
            placeholder={params.placeholder ? params.placeholder : params.label ? `Nhập ${params.label.toLowerCase()}` : ''}
            disabled={params.disabled}
            readOnly={params.readOnly}
            onChange={params.onChange}
            name={params.name}
            maxLength={params.maxLength}
            helperText={convertErrors(params.errors, params.name) && (convertErrors(params.errors, params.name)?.message?.length ? convertErrors(params.errors, params.name)?.message : `Vui lòng nhập ${(params.placeholder ? params.placeholder : params.label ? `${params.label}` : 'gía trị').toLowerCase()}`)}
        />
    </div>
}

export function DatePickerForm(params: { control: Control<FieldValues>, label?: string, required?: boolean, name: string, placeholder?: string, errors: FieldErrors<FieldValues>, disabled?: boolean, onChange?: (e?: string) => void, style?: CSSProperties, labelStyle?: CSSProperties, className?: string, pickerType?: CalendarType, hideButtonToday?: boolean }) {
    return <Controller
        name={params.name}
        control={params.control}
        rules={{ required: params.required }}
        render={({ field }) => <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(params.style ?? {}) }}>
            {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
                <Text className="label-3">{params.label}</Text>
                {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
            </div> : null}
            <DatePicker
                style={{ width: '100%', flex: params.className?.includes('row') ? 1 : undefined }}
                className="body-3"
                hideButtonToday={params.hideButtonToday}
                placeholder={params.placeholder ? params.placeholder : params.label ? `Chọn ${params.label.toLowerCase()}` : ''}
                value={field.value}
                disabled={params.disabled}
                pickerType={params.pickerType}
                onChange={(date) => {
                    field.onChange(date);
                    if (params.onChange) params.onChange(date);
                }}
                helperText={convertErrors(params.errors, params.name) && (convertErrors(params.errors, params.name)?.message?.length ? convertErrors(params.errors, params.name)?.message : `Vui lòng ${(params.placeholder ? params.placeholder : params.label ? `Chọn ${params.label}` : 'gía trị').toLowerCase()}`)}
            />
        </div>}
    />
}

// export function CKEditorForm(params: { control: Control<FieldValues>, label?: string, required?: boolean, name: string, errors: FieldErrors<FieldValues>, style?: CSSProperties, labelStyle?: CSSProperties, className?: string }) {
//     return <Controller
//         name={params.name}
//         control={params.control}
//         rules={{ required: params.required }}
//         render={({ field }) => <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(params.style ?? {}) }}>
//             {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
//                 <Text className="label-3">{params.label}</Text>
//                 {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
//             </div> : null}
//             <DefaultCkEditor
//                 className={'ckeditor-form'}
//                 style={{ flex: 1, minHeight: '32rem', height: '100%', width: '100%' }}
//                 value={field.value}
//                 onChange={field.onChange}
//             />
//         </div>}
//     />
// }

export function Select1Form(params: { options: Array<OptionsItem>, control: Control<FieldValues>, label?: string, required?: boolean, name: string, placeholder?: string, errors: FieldErrors<FieldValues>, disabled?: boolean, readonly?: boolean, onChange?: (v?: OptionsItem) => void, style?: CSSProperties, labelStyle?: CSSProperties, className?: string, handleSearch?: (e: string) => Promise<Array<OptionsItem>> }) {
    return <Controller
        name={params.name}
        control={params.control}
        rules={{ required: params.required }}
        render={({ field }) => <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(params.style ?? {}) }}>
            {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
                <Text className="label-3">{params.label}</Text>
                {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
            </div> : null}
            <Select1
                readOnly={params.readonly}
                className="body-3"
                style={{ width: '100%', padding: "0 1.6rem", height: '4rem', flex: params.className?.includes('row') ? 1 : undefined }}
                placeholder={params.placeholder ? params.placeholder : params.label ? `Chọn ${params.label.toLowerCase()}` : ''}
                value={field.value}
                options={params.options}
                disabled={params.disabled}
                onChange={(ev?: OptionsItem) => {
                    field.onChange(ev?.id)
                    if (params.onChange) params.onChange(ev)
                }}
                handleSearch={params.handleSearch}
                helperText={convertErrors(params.errors, params.name) && (convertErrors(params.errors, params.name)?.message?.length ? convertErrors(params.errors, params.name)?.message : `Vui lòng ${(params.placeholder ? params.placeholder : params.label ? `Chọn ${params.label}` : 'gía trị').toLowerCase()}`)}
            />
        </div>}
    />
}

export function SelectMultipleForm(params: { options: Array<OptionsItem>, control: Control<FieldValues>, label?: string, required?: boolean, name: string, placeholder?: string, errors: FieldErrors<FieldValues>, disabled?: boolean, onChange?: (v: Array<OptionsItem>) => void, style?: CSSProperties, labelStyle?: CSSProperties, className?: string }) {
    return <Controller
        name={params.name}
        control={params.control}
        rules={{ required: params.required }}
        render={({ field }) => {
            return <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(params.style ?? {}) }}>
                {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
                    <Text className="label-3">{params.label}</Text>
                    {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
                </div> : null}
                <SelectMultiple
                    className="body-3"
                    style={{ width: '100%', borderRadius: '0.8rem', flex: params.className?.includes('row') ? 1 : undefined }}
                    placeholder={params.placeholder ? params.placeholder : params.label ? `Chọn ${params.label.toLowerCase()}` : ''}
                    value={typeof field.value === "string" ? undefined : field.value}
                    options={params.options as any}
                    disabled={params.disabled}
                    onChange={(listValue) => {
                        field.onChange(listValue);
                        if (params.onChange) params.onChange(listValue as any);
                    }}
                    helperText={convertErrors(params.errors, params.name) && (convertErrors(params.errors, params.name)?.message?.length ? convertErrors(params.errors, params.name)?.message : `Vui lòng ${(params.placeholder ? params.placeholder : params.label ? `Chọn ${params.label}` : 'gía trị').toLowerCase()}`)} />
            </div>;
        }}
    />
}

export function SwitchForm(params: { control: Control<FieldValues>, label?: string, name: string, disabled?: boolean, onChange?: (v: boolean) => void, size?: string | number, style?: CSSProperties }) {
    return <Controller
        name={params.name}
        control={params.control}
        render={({ field }) => <div className="row" style={{ gap: '0.8rem', ...(params.style ?? {}) }}>
            <Switch name={params.name} value={field.value} disabled={params.disabled} size={params.size} onChange={(newValue) => {
                field.onChange(newValue)
                if (params.onChange) params.onChange(newValue)
            }} />
            {params.label ? <Text className="label-3" maxLine={1}>{params.label}</Text> : null}
        </div>}
    />
}

export function RateForm(params: { control: Control<FieldValues>, label?: string, name: string, onChange?: (v: number) => void, size?: string | number, style?: CSSProperties }) {
    return <Controller
        name={params.name}
        control={params.control}
        render={({ field }) => <div className="row" style={{ gap: '0.8rem', ...(params.style ?? {}) }}>
            <Rating value={field.value} size={params.size} onChange={(newValue) => {
                field.onChange(newValue)
                if (params.onChange) params.onChange(newValue)
            }} />
            {params.label ? <Text className="label-3" maxLine={1}>{params.label}</Text> : null}
        </div>}
    />
}

export function CheckboxForm(params: { control: Control<FieldValues>, label?: string, name: string, disabled?: boolean, onChange?: (v: boolean) => void, size?: string | number, radius?: string | number, style?: CSSProperties }) {
    return <Controller
        name={params.name}
        control={params.control}
        render={({ field }) => <div className="row" style={{ gap: '0.8rem', ...(params.style ?? {}) }}>
            <Checkbox value={field.value} disabled={params.disabled} size={params.size} onChange={(newValue) => {
                field.onChange(newValue)
                if (params.onChange) params.onChange(newValue)
            }} style={{ borderRadius: params.radius ?? '0.4rem' }} />
            {params.label ? typeof params.label === 'string' ? <Text className="label-4" maxLine={1}>{params.label}</Text> : params.label : null}
        </div>}
    />
}

export function RadioButtonForm(params: { value: string, label?: string, register: UseFormRegister<any>, name: string, disabled?: boolean, onChange: (event: any) => void, size: string | number }) {
    return <div className="row" style={{ gap: 4 }}>
        <RadioButton
            value={params.value}
            disabled={params.disabled}
            size={params.size ?? '1.6rem'}
            name={params.name}
            register={params.register(params.name, { onChange: params.onChange }) as any}
        />
        {params.label ? <Text className="label-3" maxLine={1}>{params.label}</Text> : null}
    </div>
}

export function ImportFileForm(params: { name: string, label?: string, control: Control<FieldValues>, maxSize?: number, allowType?: Array<string>, status?: ComponentStatus, onChange?: (a?: File) => void, title?: string, subTitle?: string, style?: CSSProperties, importStyle?: CSSProperties, labelStyle?: CSSProperties, required?: boolean, direction?: 'row' | 'column', multiple?: boolean, className?: string }) {
    return <Controller
        name={params.name}
        control={params.control}
        rules={{ required: params.required }}
        render={({ field }) => <div className={params.className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(params.style ?? {}) }}>
            {params.label ? <div className="row" style={{ gap: '0.4rem', ...(params.labelStyle ?? {}) }}>
                <Text className="label-3">{params.label}</Text>
                {params.required ? <Text className="label-4" style={{ color: '#E14337' }}>*</Text> : null}
            </div> : null}
            <ImportFile maxSize={params.maxSize} label={params.title} subTitle={params.subTitle} allowType={params.allowType} status={params.status} value={field.value} onChange={(ev) => {
                field.onChange(ev)
                if (params.onChange) params.onChange(ev)
            }} style={{ width: '100%', borderStyle: 'dashed', maxWidth: '100%', flex: params.className?.includes("row") ? 1 : undefined, ...(params.importStyle ?? {}) }} className={`${params.className ?? ''} ${params.direction ?? 'row'}`} />
        </div>}
    />
}

/** type: number | date | date-time | money */
export function RangeForm(params: { startName: string, endName: string, type?: React.HTMLInputTypeAttribute | "money", label?: string, className?: string, placeholderStart?: string, placeholderEnd?: string, style?: CSSProperties, labelStyle?: CSSProperties, disabled?: boolean, errors: FieldErrors<FieldValues>, control: Control<FieldValues>, getValues: UseFormGetValues<any> }) {
    return <div className={`input-range-container ${params.className ?? 'col'}`} style={{ gap: '0.8rem', width: '100%', ...(params.style ?? {}) }} >
        {params.label ? <Text className="label-3" style={params.labelStyle}>{params.label}</Text> : null}
        <div className="row" style={{ gap: '0.8rem', width: '100%', flex: params.className?.includes('row') ? 1 : undefined }}>
            {
                params.type === 'number' || params.type === 'money' ? <>
                    <TextField
                        style={{ width: '100%', flex: 1, ...(params.type === 'money' ? { height: '4rem', padding: '0 0 0 1.6rem' } : {}) }}
                        placeholder={params.placeholderStart ?? 'Từ'}
                        disabled={params.disabled}
                        type={params.type === 'number' ? 'number' : 'text'}
                        name={params.startName}
                        suffix={params.type === 'money' ?
                            <div className="row" style={{ padding: '0 1.6rem', height: '100%', background: 'var(--neutral-main-background-color)', borderLeft: 'var(--neutral-main-border-color)', borderRadius: '0 0.8rem 0.8rem 0' }} >
                                <Text className="button-text-3" style={{ color: 'var(--neutral-text-subtitle-color)' }}>VND</Text>
                            </div> : undefined}
                        onFocus={params.type === 'money' ? (ev) => {
                            ev.target.value = ev.target.value.replaceAll(',', '')
                            ev.target.type = "number"
                        } : undefined}
                        register={params.control.register(params.startName, {
                            onBlur: (ev) => {
                                const newValue = parseFloat(ev.target.value)
                                ev.target.type = "text"
                                if (!isNaN(newValue)) {
                                    if (params.getValues(params.endName)?.length) {
                                        const endValue = parseFloat(params.getValues(params.endName).replace(/,/g, ''))
                                        if (endValue < newValue) {
                                            params.control.setError(params.startName, { message: 'Giá trị bắt đầu phải nhỏ hơn giá trị kết thúc' })
                                        }
                                    }
                                    if (params.type === 'money') {
                                        ev.target.value = Ultis.money(newValue)
                                    }
                                } else {
                                    ev.target.value = ""
                                }
                            },
                        }) as any}
                        helperText={(convertErrors(params.errors, params.startName) || convertErrors(params.errors, params.endName)) && (convertErrors(params.errors, params.startName)?.message?.length ? convertErrors(params.errors, params.startName)?.message : `Vui lòng nhập ${params.label?.toLowerCase() ?? 'giá trị'}`)}
                    />
                    <Winicon src={"fill/arrows/arrow-right"} size={"1.4rem"} />
                    <TextField
                        style={{ width: '100%', flex: 1, ...(params.type === 'money' ? { height: '4rem', padding: '0 0 0 1.6rem' } : {}) }}
                        placeholder={params.placeholderEnd ?? 'Đến'}
                        disabled={params.disabled}
                        type={params.type === 'number' ? 'number' : 'text'}
                        name={params.endName}
                        suffix={params.type === 'money' ?
                            <div className="row" style={{ padding: '0 1.6rem', height: '100%', background: 'var(--neutral-main-background-color)', borderLeft: 'var(--neutral-main-border-color)', borderRadius: '0 0.8rem 0.8rem 0' }} >
                                <Text className="button-text-3" style={{ color: 'var(--neutral-text-subtitle-color)' }}>VND</Text>
                            </div> : undefined}
                        onFocus={params.type === 'money' ? (ev) => {
                            ev.target.value = ev.target.value.replace(/,/g, '')
                            ev.target.type = "number"
                        } : undefined}
                        register={params.control.register(params.endName, {
                            onBlur: (ev) => {
                                const newValue = parseFloat(ev.target.value)
                                ev.target.type = "text"
                                if (!isNaN(newValue)) {
                                    if (params.getValues(params.startName)?.length) {
                                        const startValue = parseFloat(params.getValues(params.startName).replace(/,/g, ''))
                                        if (startValue > newValue) {
                                            params.control.setError(params.startName, { message: 'Giá trị bắt đầu phải nhỏ hơn giá trị kết thúc' })
                                        }
                                    }
                                    if (params.type === 'money') {
                                        ev.target.value = Ultis.money(newValue)
                                    }
                                } else {
                                    ev.target.value = ""
                                }
                            },
                        }) as any}
                    />
                </> : <>
                    <Controller
                        name={params.startName}
                        control={params.control}
                        render={({ field }) => <DatePicker
                            style={{ width: '100%', flex: 1 }}
                            placeholder={params.placeholderStart ?? 'Từ'}
                            disabled={params.disabled}
                            hideButtonToday={true}
                            value={field.value}
                            pickerType={params.type === 'date-time' ? CalendarType.DATETIME : CalendarType.DATE}
                            onChange={(date) => {
                                field.onChange(date)
                                if (params.getValues(params.endName)?.length && date) {
                                    if (params.type === 'date' && differenceInCalendarDays(Ultis.stringToDate(params.getValues(params.endName)), Ultis.stringToDate(date)) < 0) {
                                        params.control.setError(params.startName, { message: 'Thời điểm bắt đầu phải nhỏ hơn thời điểm kết thúc' })
                                    } else if (params.type === 'date-time' && differenceInMinutes(Ultis.stringToDate(params.getValues(params.endName), 'dd/mm/yyyy hh:mm'), Ultis.stringToDate(date, 'dd/mm/yyyy hh:mm')) < 0) {
                                        params.control.setError(params.startName, { message: 'Thời điểm bắt đầu phải nhỏ hơn thời điểm kết thúc' })
                                    }
                                }
                            }}
                            helperText={(convertErrors(params.errors, params.startName) || convertErrors(params.errors, params.endName)) && (convertErrors(params.errors, params.startName)?.message?.length ? convertErrors(params.errors, params.startName)?.message : `Vui lòng nhập ${params.label?.toLowerCase() ?? 'giá trị'}`)}
                        />}
                    />
                    <Winicon src={"fill/arrows/arrow-right"} size={"1.4rem"} />
                    <Controller
                        name={params.endName}
                        control={params.control}
                        render={({ field }) => <DatePicker
                            style={{ width: '100%', flex: 1 }}
                            placeholder={params.placeholderEnd ?? 'Đến'}
                            disabled={params.disabled}
                            hideButtonToday={true}
                            value={field.value}
                            pickerType={params.type === 'date-time' ? CalendarType.DATETIME : CalendarType.DATE}
                            onChange={(date) => {
                                field.onChange(date)
                                if (params.getValues(params.startName)?.length && date) {
                                    if (params.type === 'date' && differenceInCalendarDays(Ultis.stringToDate(date), Ultis.stringToDate(params.getValues(params.startName))) < 0) {
                                        params.control.setError(params.startName, { message: 'Thời điểm bắt đầu phải nhỏ hơn thời điểm kết thúc' })
                                    } else if (params.type === 'date-time' && differenceInMinutes(Ultis.stringToDate(date, 'dd/mm/yyyy hh:mm'), Ultis.stringToDate(params.getValues(params.startName), 'dd/mm/yyyy hh:mm')) < 0) {
                                        params.control.setError(params.startName, { message: 'Thời điểm bắt đầu phải nhỏ hơn thời điểm kết thúc' })
                                    }
                                }
                            }}
                        />}
                    />
                </>
            }
        </div>
    </div>
}

/** dataType: string | list */
export function GroupCheckboxForm(params: { label?: string, dataType: 'string' | 'list', className?: string, options: Array<OptionsItem>, disabled?: boolean, name: string, control: Control<FieldValues>, style?: CSSProperties, labelStyle?: CSSProperties, onChange?: (v: Array<OptionsItem>) => void }) {
    return <Controller
        name={params.name}
        control={params.control}
        render={({ field }) => <div className={params.className ?? 'col'} style={{ gap: '0.8rem', width: '100%', alignItems: 'start', ...(params.style ?? {}) }}>
            {params.label ? <Text className="label-3" style={params.labelStyle}>{params.label}</Text> : null}
            <div className={params.className ?? 'col'} style={{ gap: 'inherit', flex: params.className?.includes('row') ? 1 : undefined, flexWrap: params.className?.includes('row') ? 'wrap' : undefined }}>
                {params.options.map(e => {
                    return <div key={e.id} className="row" style={{ gap: '0.8rem' }}>
                        <Checkbox
                            disabled={params.disabled}
                            size={'1.6rem'}
                            value={(params.dataType === 'string' ? (field.value?.split(',') ?? []) : field.value).includes(e.id)}
                            onChange={(vl) => {
                                let listValue = params.dataType === 'string' ? (field.value?.split(',') ?? []) : field.value
                                if (vl) {
                                    listValue.push(e.id)
                                } else {
                                    listValue = listValue.filter((el: any) => el.id !== e.id)
                                }
                                listValue = params.dataType === 'string' ? listValue.join(',') : listValue
                                field.onChange(listValue)
                                if (params.onChange) params.onChange(listValue)
                            }}
                        />
                        <Text className="label-4" maxLine={1}>{e.name}</Text>
                    </div>
                })}
            </div>
        </div>}
    />
}

const convertErrors = (errors: any, name: string) => {
    if (errors && Object.keys(errors).length) {
        const props = name.split(/[.\[\]]/).filter(e => e?.length > 0)
        var value = errors
        for (let p of props) {
            if (value)
                value = value[p]
        }
        return value
    }
    return undefined
}