<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Tenant\StatementTemplate;
use App\Models\Tenant\Tag;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;


class StatementTemplateController extends Controller
{
    //

    public function index(Request $request): Response
    {
        $templates = StatementTemplate::all();

        return response($templates);
    }

    public function store(Request $request): Response
    {
        $data = $request->all();
        $template = StatementTemplate::create($data);

        return response($template);
    }

    private function templateParser(string $template): string
    {
        $service = new TagService();

        $newtemplate = preg_match_all('/\{\{(\w+)\}\}/', $template, $matches);
        $fields = array_combine($matches[0], $matches[1]);
        $fieldsProcessed = [];
        foreach ($fields as $key => $value) {
            $tag = Tag::where('label', $value)->first();
            $tagBalance = $service->getTagMembersBalance($tag->id);
            $fieldsProcessed[$key] = $tagBalance;
        }

        $templateProcessed = str_replace(array_keys($fieldsProcessed), array_values($fieldsProcessed), $template);

        Log::info($matches, [__LINE__, __FILE__]);
        Log::info($fields, [__LINE__, __FILE__]);
        Log::info($fieldsProcessed, [__LINE__, __FILE__]);
        Log::info($templateProcessed, [__LINE__, __FILE__]);
        return $templateProcessed;
    }
    public function show(Request $request, int $statementTemplate): Response
    {
        $template = StatementTemplate::find($statementTemplate);

        // $final = $this->templateParser($template->content);
        // $template->content = $final;
        // Log::info($statementTemplate, [__LINE__, __FILE__]);
        return response($template);
    }
}
