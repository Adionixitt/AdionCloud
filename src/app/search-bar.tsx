import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    query: z.string().min(0).max(200),
})
export function SearchBar({query, setQuery}: {query:string, setQuery:Dispatch<SetStateAction<string>>}) {

    const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		  query: "",
		},
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query)
    }

    return <div>
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex direction-row gap-2 items-center">
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input {...field} placeholder="Поиск по названию файла" value={query} onChange={e => setQuery(e.target.value)} autoFocus className="w-96" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {/* <Button
                        disabled={form.formState.isSubmitting}
                        variant={"outline"}
                        type="submit">
                            {
                                form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            }
                            Найти
                    </Button> */}
                </form>
            </Form>
    </div>
}